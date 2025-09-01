import { IS_PRODUCTION } from '@/constants/common';
import {
  SUBSCRIPTION_PLAN_CREDITS,
  SUBSCRIPTION_PLAN_NAMES,
} from '@/constants/credits';
import { sendErrorEmail } from '@/lib/email';
import { getSubscription } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;

    const subscriptionId = searchParams.get('subscription_id');
    if (!subscriptionId) {
      throw new Error('Subscription ID is required', {
        cause: {
          subscriptionId,
        },
      });
    }

    const subscription = await getSubscription({ subscriptionId });
    if (subscription.status !== 'ACTIVE') {
      throw new Error('Subscription is not active', {
        cause: {
          subscription,
        },
      });
    }

    const subscriberCustomId = subscription.custom_id;
    if (!subscriberCustomId) {
      throw new Error('Subscriber custom ID is required', {
        cause: {
          subscription,
        },
      });
    }

    const subscriptionPlanId = subscription.plan_id;
    if (!subscriptionPlanId) {
      throw new Error('Subscription plan ID is required', {
        cause: {
          subscription,
        },
      });
    }

    const subscriptionPlanCredits =
      SUBSCRIPTION_PLAN_CREDITS[subscriptionPlanId];
    if (!subscriptionPlanCredits) {
      throw new Error('Subscription plan credits is required', {
        cause: {
          subscription,
        },
      });
    }

    const subscriptionPlanName =
      SUBSCRIPTION_PLAN_NAMES[
        subscriptionPlanId as keyof typeof SUBSCRIPTION_PLAN_NAMES
      ];
    if (!subscriptionPlanName) {
      throw new Error('Subscription plan name is required', {
        cause: {
          subscription,
        },
      });
    }

    const subscriptionCreditResetDate = new Date(
      Date.now() + 31 * 24 * 60 * 60 * 1000,
    );

    await prisma.user.update({
      where: { id: parseInt(subscriberCustomId) },
      data: {
        subscriptionPlanId: subscriptionPlanId,
        subscriptionPlanName: subscriptionPlanName,
        subscriptionCredits: subscriptionPlanCredits,
        subscriptionActive: true,
        subscriptionCreditResetDate: subscriptionCreditResetDate.toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.redirect(
      new URL(
        '/dashboard/billing?tab=subscription&buy_subscription_success=1',
        request.url,
      ),
    );
  } catch (error: unknown) {
    if (IS_PRODUCTION) {
      sendErrorEmail({ error });
    } else {
      console.log('Error in capture subscription order:', error);
    }
    return NextResponse.redirect(
      new URL(
        '/dashboard/billing?tab=subscription&buy_subscription_failure=1',
        request.url,
      ),
    );
  }
}
