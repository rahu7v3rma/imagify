import {
    Client,
    Environment,
    OrdersController,
} from '@paypal/paypal-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
// import {
//     getUserCredits,
//     updateUserCredits,
//     createUserCredits
// } from '@/lib/firebase';

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
    },
    environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);

export async function GET(request: NextRequest) {
    console.log('🔄 Starting PayPal order capture process');
    console.log('🔑 API Keys check:');
    console.log(`   PAYPAL_CLIENT_ID: ${process.env.PAYPAL_CLIENT_ID?.slice(0, 2)}***${process.env.PAYPAL_CLIENT_ID?.slice(-2)}`);
    console.log(`   PAYPAL_CLIENT_SECRET: ${process.env.PAYPAL_CLIENT_SECRET?.slice(0, 2)}***${process.env.PAYPAL_CLIENT_SECRET?.slice(-2)}`);
    
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        
        console.log('📥 Request URL:', request.url);
        console.log('🎫 PayPal token:', token);

        if (!token) {
            console.log('❌ No token found, redirecting to failure');
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        console.log('💳 Capturing PayPal order...');
        // Capture the order
        const { result: captureResult } = await ordersController.captureOrder({
            id: token,
            body: {}
        });

        console.log('📄 PayPal capture result:', {
            id: captureResult.id,
            status: captureResult.status,
            purchaseUnitsCount: captureResult.purchaseUnits?.length
        });

        console.log('🔍 Extracting payment details...');
        const amount = parseFloat(captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.value || '0');
        const userId = captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId;
        
        console.log('📋 Extracted data:', { amount, userId });
        console.log('💰 Raw amount from PayPal:', captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.value);
        console.log('👤 Custom ID (User ID):', captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId);
        
        if (!amount || !userId) {
            console.log('❌ Missing amount or userId:', { amount, userId });
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        console.log('✅ Payment details validated successfully');

        // Check if payment was successfully captured
        console.log('🔍 Checking capture status...');
        if (captureResult.status === 'COMPLETED') {
            console.log('✅ Payment capture completed successfully');

            // Convert amount to credits (assuming 1 USD = 100 credits, adjust as needed)
            const creditsToAdd = Math.floor(amount * 100);
            console.log('💰 Credit calculation:', `${amount} USD * 100 = ${creditsToAdd} credits`);

            // Get user's current credits
            console.log('🔍 Fetching current user credits...');
            // const currentCreditsData = await getUserCredits(userId);
            // console.log('📊 Current credits data:', currentCreditsData);
            // Temporary fallback for testing
            const currentCreditsData = { credits: 50 };

            if (currentCreditsData) {
                // User exists, update credits
                const newCredits = currentCreditsData.credits + creditsToAdd;
                console.log(`📈 Updating credits: ${currentCreditsData.credits} + ${creditsToAdd} = ${newCredits}`);
                // await updateUserCredits(userId, newCredits);
                console.log('✅ User credits updated successfully (commented out)');
            } else {
                // User doesn't exist, create new credits document with 0 initial credits
                console.log('🆕 Creating new credits record for user with 0 initial credits');
                // await createUserCredits(userId, 0);
                // Fetch the created document
                // const newCreditsData = await getUserCredits(userId);
                // if (newCreditsData) {
                //     const newCredits = newCreditsData.credits + creditsToAdd;
                //     console.log(`📈 Adding credits to new user: ${newCreditsData.credits} + ${creditsToAdd} = ${newCredits}`);
                //     await updateUserCredits(userId, newCredits);
                //     console.log('✅ New user credits created and updated successfully');
                // }
                console.log('✅ New user credits creation (commented out)');
            }

            console.log('🎉 Payment processing completed successfully, redirecting to success');
            // Payment successful - redirect to success page
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=success', request.url)
            );
        } else {
            console.log(`❌ Payment capture failed. Status: ${captureResult.status}, redirecting to failure`);
            // Payment failed - redirect to failure page
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

    } catch (error: unknown) {
        console.error('💥 Error capturing order:');
        console.error('Error type:', typeof error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('Full error object:', error);
        
        return NextResponse.redirect(
            new URL('/dashboard/billing?status=failure', request.url)
        );
    }
}
