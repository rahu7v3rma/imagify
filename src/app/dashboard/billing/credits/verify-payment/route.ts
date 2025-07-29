import { NextRequest, NextResponse } from 'next/server';
// import {
//     getUserCredits,
//     createUserCredits,
//     updateUserCredits,
//     createUserTransaction,
//     getUserTransaction,
// } from '@/lib/firebase';
import Razorpay from 'razorpay';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function GET(request: NextRequest) {
    console.log('🔄 Starting payment verification process');
    console.log('🔑 API Keys check:');
    console.log(`   RAZORPAY_KEY_ID: ${RAZORPAY_KEY_ID?.slice(0, 2)}***${RAZORPAY_KEY_ID?.slice(-2)}`);
    console.log(`   RAZORPAY_KEY_SECRET: ${RAZORPAY_KEY_SECRET?.slice(0, 2)}***${RAZORPAY_KEY_SECRET?.slice(-2)}`);
    
    try {
        const { searchParams } = new URL(request.url);
        const paymentLinkId = searchParams.get('razorpay_payment_link_id');
        
        console.log('📥 Request URL:', request.url);
        console.log('🔗 Payment Link ID:', paymentLinkId);

        if (!paymentLinkId) {
            console.log('❌ No payment link ID found, redirecting to failure');
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        console.log('🏗️ Creating Razorpay instance...');
        const instance = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('✅ Razorpay instance created successfully');

        console.log('🔍 Fetching payment link from Razorpay...');
        let paymentLink = await instance.paymentLink.fetch(paymentLinkId);
        console.log('📄 Payment link fetched:', {
            id: paymentLink.id,
            status: paymentLink.status,
            amount: paymentLink.amount,
            notes: paymentLink.notes
        });

        // Check if transaction already exists with status "paid"
        console.log('🔍 Checking for existing transaction...');
        // const existingTransaction = await getUserTransaction(paymentLinkId);
        // console.log('📊 Existing transaction:', existingTransaction);
        // Temporary fallback for testing
        const existingTransaction = null;
        
        // if (existingTransaction && existingTransaction.status === 'paid') {
        //     console.log('⚠️ Transaction already exists with paid status, redirecting to failure');
        //     return NextResponse.redirect(
        //         new URL('/dashboard/billing?status=failure', request.url)
        //     );
        // }

        console.log('💳 Checking payment status...');
        if (paymentLink.status !== 'paid') {
            console.log(`❌ Payment not completed. Status: ${paymentLink.status}, redirecting to failure`);
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }
        console.log('✅ Payment status confirmed as paid');

        const userId = String(paymentLink.notes?.userId || '');
        const amount = Number(paymentLink.amount);
        
        console.log('📋 Extracted data:', { userId, amount });

        if (!userId || !amount) {
            console.log('❌ Missing userId or amount:', { userId, amount });
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        const creditsToAdd = Math.floor(amount);
        console.log('💰 Credits to add:', creditsToAdd);
        
        console.log('🔍 Fetching current user credits...');
        // const currentCreditsData = await getUserCredits(userId);
        // console.log('📊 Current credits data:', currentCreditsData);
        // Temporary fallback for testing
        const currentCreditsData = { credits: 50 };

        if (currentCreditsData) {
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

        // Create transaction record in Firebase
        console.log('📝 Creating transaction record...');
        // await createUserTransaction(paymentLinkId, userId, 'paid');
        console.log('✅ Transaction record created successfully (commented out)');

        console.log('🎉 Payment verification completed successfully, redirecting to success');
        return NextResponse.redirect(
            new URL('/dashboard/billing?status=success', request.url)
        );

    } catch (error: unknown) {
        console.error('💥 Error verifying payment:');
        console.error('Error type:', typeof error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('Full error object:', error);
        
        return NextResponse.redirect(
            new URL('/dashboard/billing?status=failure', request.url)
        );
    }
} 