import { NextRequest, NextResponse } from 'next/server';
import {
    adminGetUserCredits,
    adminCreateUserCredits,
    adminUpdateUserCredits,
    adminCreateUserTransaction,
    adminGetUserTransaction,
} from '@/lib/firebase-admin';
import Razorpay from 'razorpay';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentLinkId = searchParams.get('razorpay_payment_link_id');

        if (!paymentLinkId) {
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        const instance = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
            headers: { 'Content-Type': 'application/json' }
        });

        let paymentLink = await instance.paymentLink.fetch(paymentLinkId);

        // Check if transaction already exists with status "paid"
        const existingTransaction = await adminGetUserTransaction(paymentLinkId);
        if (existingTransaction && existingTransaction.status === 'paid') {
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        if (paymentLink.status !== 'paid') {
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        const userId = String(paymentLink.notes?.userId || '');
        const amount = Number(paymentLink.amount);

        if (!userId || !amount) {
            return NextResponse.redirect(
                new URL('/dashboard/billing?status=failure', request.url)
            );
        }

        const creditsToAdd = Math.floor(amount);
        const currentCreditsData = await adminGetUserCredits(userId);

        if (currentCreditsData) {
            const newCredits = currentCreditsData.credits + creditsToAdd;
            await adminUpdateUserCredits(userId, newCredits);
        } else {
            await adminCreateUserCredits(userId, creditsToAdd);
        }

        // Create transaction record in Firebase
        await adminCreateUserTransaction(paymentLinkId, userId, 'paid');

        return NextResponse.redirect(
            new URL('/dashboard/billing?status=success', request.url)
        );

    } catch (error: unknown) {
        return NextResponse.redirect(
            new URL('/dashboard/billing?status=failure', request.url)
        );
    }
} 