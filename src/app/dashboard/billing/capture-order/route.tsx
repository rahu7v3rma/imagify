import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paypalOrdersController } from "@/lib/paypal";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?buy_credits_failure=1", request.url)
      );
    }

    const { result: captureResult } = await paypalOrdersController.captureOrder(
      {
        id: token,
        body: {},
      }
    );

    const amount = parseFloat(
      captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount
        ?.value || "0"
    );
    const userId =
      captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId;

    if (!amount || !userId) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?buy_credits_failure=1", request.url)
      );
    }

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.redirect(
        new URL("/dashboard/billing?buy_credits_failure=1", request.url)
      );
    }

    const creditsToAdd = Math.floor(amount * 100);
    const parsedUserId = parseInt(userId);

    // Update user credits using Prisma
    await prisma.user.update({
      where: { id: parsedUserId },
      data: {
        credits: {
          increment: creditsToAdd,
        },
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard/billing?buy_credits_success=1", request.url)
    );
  } catch (error: unknown) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?buy_credits_failure=1", request.url)
    );
  }
}
