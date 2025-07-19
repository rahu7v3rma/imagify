import {
    Client,
    Environment,
    OrdersController,
} from '@paypal/paypal-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import {
    adminGetUserCredits,
    adminUpdateUserCredits,
    adminCreateUserCredits
} from '@/lib/firebase-admin';

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
    },
    environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        // Capture the order
        const { result: captureResult } = await ordersController.captureOrder({
            id: token,
            body: {}
        });

        const amount = parseFloat(captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.value || '0');
        const userId = captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId;
        if (!amount || !userId) {
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        // Check if payment was successfully captured
        if (captureResult.status === 'COMPLETED') {

            // Convert amount to credits (assuming 1 USD = 100 credits, adjust as needed)
            const creditsToAdd = Math.floor(amount * 100);

            // Get user's current credits
            const currentCreditsData = await adminGetUserCredits(userId);

            if (currentCreditsData) {
                // User exists, update credits
                const newCredits = currentCreditsData.credits + creditsToAdd;
                await adminUpdateUserCredits(userId, newCredits);
            } else {
                // User doesn't exist, create new credits document
                await adminCreateUserCredits(userId, creditsToAdd);
            }


            // Payment successful - redirect to success page
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=success', request.url)
            );
        } else {
            // Payment failed - redirect to failure page
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

    } catch (error: unknown) {
        return NextResponse.redirect(
            new URL('/dashboard/billing?status=failure', request.url)
        );
    }
}
