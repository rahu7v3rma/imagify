import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrdersController,
  OrderRequest,
  OrderApplicationContextShippingPreference,
} from '@paypal/paypal-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { admin } from '@/lib/firebase-admin';

const createOrderSchema = z.object({
  amount: z.number().min(5, "Minimum amount is $5.00").max(100, "Maximum amount is $100.00")
});

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
  },
  environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);

export async function POST(request: NextRequest) {
  try {
    // Get and verify Firebase ID token from authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header with Bearer token is required",
        },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    let userId: string;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);
    const { amount } = validatedData;

    const orderPayload: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD',
            value: amount.toFixed(2),
          },
          customId: userId
        }
      ],
      applicationContext: {
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/credits/capture-order`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        shippingPreference: OrderApplicationContextShippingPreference.NoShipping,
      }
    };

    const { result } = await ordersController.createOrder({
      body: orderPayload
    });

    const approvalLink = result.links?.find(link => link.rel === 'approve' || link.rel === 'payer-action')?.href;

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        paypalLink: approvalLink
      }
    }, { status: 201 });

  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
