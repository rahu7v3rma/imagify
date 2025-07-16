import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createOrderSchema = z.object({
  amount: z.number().min(1).max(100)
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
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);
    const { amount } = validatedData;

    const orderPayload = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: amount.toFixed(2),
            },
          }
        ],
      }
    };

    const { result } = await ordersController.createOrder({
      body: orderPayload.body
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
