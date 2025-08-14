import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paypalOrdersController } from "@/lib/paypal";
import { sendErrorEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      throw new Error("Token is required", {
        cause: {
          token,
        },
      });
    }

    const captureResponse = await paypalOrdersController.captureOrder({
      id: token,
      body: {},
    });

    const captureResult = captureResponse.result;

    const amount = parseFloat(
      captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount
        ?.value || "0"
    );
    const userId =
      captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.customId;
    const orderId = captureResult.id;

    if (!orderId) {
      throw new Error("Order ID is required", {
        cause: {
          captureResult,
        },
      });
    }

    if (!amount || !userId) {
      throw new Error("Invalid capture result", {
        cause: {
          captureResult,
        },
      });
    }

    if (captureResult.status !== "COMPLETED") {
      throw new Error("Invalid capture status", {
        cause: {
          captureResult,
        },
      });
    }

    const creditsToAdd = Math.floor(amount * 100);
    const parsedUserId = parseInt(userId);

    // Create order record
    await prisma.order.create({
      data: {
        orderId: orderId,
        userId: parsedUserId,
      },
    });

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
    sendErrorEmail({ error });
    return NextResponse.redirect(
      new URL("/dashboard/billing?buy_credits_failure=1", request.url)
    );
  }
}
