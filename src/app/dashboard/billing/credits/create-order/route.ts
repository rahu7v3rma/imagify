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
import requestIp from 'request-ip';
import { getUser } from '@/lib/request';
import Razorpay from 'razorpay';

const createOrderSchema = z.object({
  amount: z.number().min(5, "Minimum amount is 5").max(100, "Maximum amount is 100"),
});

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
  },
  environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Function to get client IP from request using request-ip package
function getClientIP(request: NextRequest): string {
  const ip = requestIp.getClientIp(request as any);
  console.log(ip, 'detected IP');

  // Fallback if no IP is detected
  return ip || '8.8.8.8';
}

// Function to get country code from IP using IPinfo API
async function getCountryFromIP(ip: string): Promise<string> {
  try {
    console.log(ip, 'ip');
    const response = await fetch(`https://api.ipinfo.io/lite/${ip}?token=${process.env.IPINFO_API_TOKEN}`);

    if (!response.ok) {
      console.warn('Failed to get IP info, defaulting to US');
      return 'US';
    }

    const data = await response.json();
    console.log(data, 'data');
    return data.country_code || 'US';
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return 'US'; // Default to US if API fails
  }
}

async function createPayPalOrder(amount: number, userId: string) {
  const orderPayload: OrderRequest = {
    intent: CheckoutPaymentIntent.Capture,
    purchaseUnits: [
      {
        amount: {
          currencyCode: 'USD',
          value: String(amount),
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

  return approvalLink;
}

async function createRazorpayPaymentLink(amount: number, userId: string) {
  const amountInSmallestUnit = Math.round(amount * 100);

  const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!
  });

  const paymentLinkData = {
    amount: amountInSmallestUnit,
    currency: 'USD',
    customer: {

    },
    notes: {
      userId: userId
    },
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/credits/verify-payment`,
  };

  try {
    const result = await instance.paymentLink.create(paymentLinkData);
    return result.short_url;
  } catch (error: any) {
    throw new Error(`Razorpay API error: ${error.error?.description || 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUser(request);

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);
    const { amount } = validatedData;

    // Get client IP and determine country
    const clientIP = getClientIP(request);
    const countryCode = await getCountryFromIP(clientIP);

    let paymentLink;
    let paymentProvider;

    // Use Razorpay for India, PayPal for other countries
    if (countryCode === 'IN') {
      paymentLink = await createRazorpayPaymentLink(amount, userId);
      paymentProvider = 'razorpay';
    } else {
      paymentLink = await createPayPalOrder(amount, userId);
      paymentProvider = 'paypal';
    }

    return NextResponse.json({
      success: true,
      message: 'Payment link created successfully',
      data: {
        paymentLink: paymentLink,
        paymentProvider: paymentProvider,
        countryCode: countryCode,
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating order:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
