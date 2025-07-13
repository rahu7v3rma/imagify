import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  adminGetUserCredits,
  adminCreateUserCredits,
  adminUpdateUserCredits,
} from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("CHECKOUT_SESSION_ID");

    if (!sessionId) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/billing?payment=error&message=Session ID missing",
          request.url,
        ),
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const isPaid = session.payment_status === "paid";
    const amountTotal = session.amount_total;
    const clientReferenceId = session.client_reference_id;

    if (isPaid && clientReferenceId && amountTotal) {
      const creditsToAdd = Math.floor(amountTotal);

      const existingCredits = await adminGetUserCredits(clientReferenceId);

      if (existingCredits) {
        const totalCredits = existingCredits.credits + creditsToAdd;
        await adminUpdateUserCredits(clientReferenceId, totalCredits);
      } else {
        await adminCreateUserCredits(clientReferenceId, creditsToAdd);
      }

      return NextResponse.redirect(
        new URL(
          "/dashboard/billing?payment=success&amount=" + (amountTotal || 0),
          request.url,
        ),
      );
    } else {
      return NextResponse.redirect(
        new URL(
          "/dashboard/billing?payment=failed&message=Payment not completed",
          request.url,
        ),
      );
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/billing?payment=error&message=Failed to verify payment",
        request.url,
      ),
    );
  }
}
