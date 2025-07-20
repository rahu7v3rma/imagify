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
import IPinfoWrapper from 'node-ipinfo';

const createOrderSchema = z.object({
  amount: z.number().min(5, "Minimum amount is 5").max(100, "Maximum amount is 100"),
});

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
  },
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

const ordersController = new OrdersController(client);

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Function to get client IP from request using request-ip package
function getClientIP(request: NextRequest): string {
  const ip = requestIp.getClientIp(request as any);

  // Fallback if no IP is detected
  return ip || '8.8.8.8';
}

// Initialize IPinfo client
const ipinfo = new IPinfoWrapper(process.env.IPINFO_API_TOKEN!);

// Function to get country code from IP using IPinfo library
async function getCountryFromIP(ip: string): Promise<string> {
  try {
    console.log('🌍 Looking up country for IP:', ip);
    const response = await ipinfo.lookupIp(ip);
    console.log('📍 Country lookup result:', response.country || 'US');
    return response.country || 'US';
  } catch (error) {
    console.log('⚠️ Country lookup failed, defaulting to US:', error);
    return 'US'; // Default to US if API fails
  }
}

async function createPayPalOrder(amount: number, userId: string) {
  console.log('💳 Creating PayPal order:', { amount, userId });
  
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

  console.log('📋 PayPal order payload:', {
    intent: orderPayload.intent,
    amount: orderPayload.purchaseUnits?.[0]?.amount,
    customId: orderPayload.purchaseUnits?.[0]?.customId,
    returnUrl: orderPayload.applicationContext?.returnUrl
  });

  const { result } = await ordersController.createOrder({
    body: orderPayload
  });

  console.log('📄 PayPal order created:', {
    id: result.id,
    status: result.status,
    linksCount: result.links?.length
  });

  const approvalLink = result.links?.find(link => link.rel === 'approve' || link.rel === 'payer-action')?.href;
  console.log('🔗 PayPal approval link:', approvalLink);

  return approvalLink;
}

async function createRazorpayPaymentLink(amount: number, userId: string) {
  console.log('💳 Creating Razorpay payment link:', { amount, userId });
  
  const amountInSmallestUnit = Math.round(amount * 100);
  console.log('💰 Amount conversion:', `${amount} USD -> ${amountInSmallestUnit} cents`);

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

  console.log('📋 Razorpay payment link data:', {
    amount: paymentLinkData.amount,
    currency: paymentLinkData.currency,
    userId: paymentLinkData.notes.userId,
    callback_url: paymentLinkData.callback_url
  });

  try {
    const result = await instance.paymentLink.create(paymentLinkData);
    console.log('✅ Razorpay payment link created:', {
      id: result.id,
      short_url: result.short_url,
      status: result.status
    });
    return result.short_url;
  } catch (error: any) {
    console.error('❌ Razorpay payment link creation failed:', error);
    throw new Error(`Razorpay API error: ${error.error?.description || 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  console.log('🔄 Starting create order process');
  console.log('🔑 API Keys check:');
  console.log(`   PAYPAL_CLIENT_ID: ${process.env.PAYPAL_CLIENT_ID?.slice(0, 2)}***${process.env.PAYPAL_CLIENT_ID?.slice(-2)}`);
  console.log(`   PAYPAL_CLIENT_SECRET: ${process.env.PAYPAL_CLIENT_SECRET?.slice(0, 2)}***${process.env.PAYPAL_CLIENT_SECRET?.slice(-2)}`);
  console.log(`   RAZORPAY_KEY_ID: ${RAZORPAY_KEY_ID?.slice(0, 2)}***${RAZORPAY_KEY_ID?.slice(-2)}`);
  console.log(`   RAZORPAY_KEY_SECRET: ${RAZORPAY_KEY_SECRET?.slice(0, 2)}***${RAZORPAY_KEY_SECRET?.slice(-2)}`);
  console.log(`   IPINFO_API_TOKEN: ${process.env.IPINFO_API_TOKEN?.slice(0, 2)}***${process.env.IPINFO_API_TOKEN?.slice(-2)}`);
  
  try {
    console.log('👤 Getting user from request...');
    const userId = await getUser(request);
    console.log('✅ User ID retrieved:', userId);

    console.log('📥 Parsing request body...');
    const body = await request.json();
    console.log('📋 Request body:', body);
    
    console.log('🔍 Validating request data...');
    const validatedData = createOrderSchema.parse(body);
    const { amount } = validatedData;
    console.log('✅ Data validation passed:', { amount });

    // Get client IP and determine country
    console.log('🌐 Detecting client IP...');
    const clientIP = getClientIP(request);
    console.log('📡 Client IP detected:', clientIP);
    
    const countryCode = await getCountryFromIP(clientIP);
    console.log('🏳️ Country determined:', countryCode);

    let paymentLink;
    let paymentProvider;

    // Use Razorpay for India, PayPal for other countries
    if (countryCode === 'IN') {
      console.log('🇮🇳 Indian user detected, using Razorpay...');
      paymentLink = await createRazorpayPaymentLink(amount, userId);
      paymentProvider = 'razorpay';
      console.log('✅ Razorpay payment link created successfully');
    } else {
      console.log('🌍 Non-Indian user detected, using PayPal...');
      paymentLink = await createPayPalOrder(amount, userId);
      paymentProvider = 'paypal';
      console.log('✅ PayPal order created successfully');
    }

    const responseData = {
      success: true,
      message: 'Payment link created successfully',
      data: {
        paymentLink: paymentLink,
        paymentProvider: paymentProvider,
        countryCode: countryCode,
      }
    };

    console.log('🎉 Order creation completed successfully');
    console.log('📤 Response data:', responseData);

    return NextResponse.json(responseData, { status: 201 });

  } catch (error: unknown) {
    console.error('💥 Error creating order:');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}
