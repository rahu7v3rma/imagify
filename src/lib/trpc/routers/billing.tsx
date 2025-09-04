import { IS_PRODUCTION } from '@/constants/common';
import {
  BILLING_CONSTANTS,
  RAZORPAY_SUBSCRIPTION_STANDARD_PLAN_ID,
  RAZORPAY_SUBSCRIPTION_PLAN_CREDITS,
  RAZORPAY_SUBSCRIPTION_PLAN_NAMES,
} from '@/constants/credits';
import { sendErrorEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';
import { protectedProcedure, router } from '@/lib/trpc/init';
import { z } from 'zod';

const AmountSchema = z.object({
  amount: z
    .number()
    .min(
      BILLING_CONSTANTS.MIN_AMOUNT,
      `Amount must be at least $${BILLING_CONSTANTS.MIN_AMOUNT}`,
    )
    .max(100, 'Amount must be at most $100'),
});

const CreateOrderOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      orderId: z.string(),
      amount: z.number(),
    })
    .nullable(),
});

const CreateRazorpaySubscriptionOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      subscriptionId: z.string(),
    })
    .nullable(),
});

const VerifyRazorpaySubscriptionInputSchema = z.object({
  subscriptionId: z.string(),
  paymentId: z.string(),
});

export const billingRouter = router({
  createOrder: protectedProcedure
    .input(AmountSchema)
    .output(CreateOrderOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return {
            success: false,
            message: 'Unauthorized',
            data: null,
          };
        }

        const { amount } = input;

        const order = await razorpay.orders.create({
          amount: amount * 100,
          currency: 'USD',
        });

        if (!order?.id) {
          throw new Error('Failed to generate payment URL', {
            cause: order,
          });
        }

        return {
          success: true,
          message: 'Order created successfully',
          data: {
            orderId: order.id,
            amount: Number(order.amount),
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in billing create order:', error);
        }
        return {
          success: false,
          message: 'Failed to create order',
          data: null,
        };
      }
    }),
  verifyOrder: protectedProcedure
    .input(z.object({ orderId: z.string(), paymentId: z.string() }))
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return {
            success: false,
            message: 'Unauthorized',
          };
        }

        const { orderId, paymentId } = input;

        const order = await razorpay.orders.fetch(orderId);

        if (order?.status !== 'paid') {
          throw new Error('Order is not paid', {
            cause: {
              orderId,
            },
          });
        }

        const paymentCurrent = order.currency;
        if (paymentCurrent !== 'USD') {
          throw new Error('Payment currency is not USD', {
            cause: {
              order,
            },
          });
        }

        const amount = Number(order.amount);
        if (!amount) {
          throw new Error('Invalid amount', {
            cause: {
              order,
            },
          });
        }

        const creditsToAdd = Math.floor(amount);
        const parsedUserId = Number(ctx.user.id);

        // Create order record
        await prisma.payments.create({
          data: {
            userId: parsedUserId,
            paymentId: paymentId,
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

        return {
          success: true,
          message: 'Order verified successfully',
        };
      } catch (error: unknown) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in verify order:', error);
        }
        return {
          success: false,
          message: 'Failed to verify order',
        };
      }
    }),
  createRazorpaySubscription: protectedProcedure
    .output(CreateRazorpaySubscriptionOutputSchema)
    .mutation(async ({ ctx }) => {
      try {
        if (!ctx.user) {
          return {
            success: false,
            message: 'Unauthorized',
            data: null,
          };
        }

        const subscription = await razorpay.subscriptions.create({
          plan_id: RAZORPAY_SUBSCRIPTION_STANDARD_PLAN_ID,
          total_count: 12,
        });

        if (!subscription?.id) {
          throw new Error('Failed to create subscription', {
            cause: subscription,
          });
        }

        return {
          success: true,
          message: 'Subscription created successfully',
          data: {
            subscriptionId: subscription.id,
          },
        };
      } catch (error: any) {
        if (IS_PRODUCTION) {
          sendErrorEmail({ error });
        } else {
          console.log('Error in billing createRazorpaySubscription:', error);
        }
        return {
          success: false,
          message: 'Failed to create subscription',
          data: null,
        };
      }
    }),
  verifyRazorpaySubscription: protectedProcedure
    .input(VerifyRazorpaySubscriptionInputSchema)
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'Unauthorized' };
        }

        const { subscriptionId, paymentId } = input;

        const subscription = await razorpay.subscriptions.fetch(subscriptionId);

        const status = subscription?.status;
        if (status !== 'created') {
          throw new Error('Subscription is not created', {
            cause: {
              subscriptionId,
              status,
            },
          });
        }

        const planId = subscription.plan_id;
        const planName = RAZORPAY_SUBSCRIPTION_PLAN_NAMES[planId];
        const planCredits = RAZORPAY_SUBSCRIPTION_PLAN_CREDITS[planId];
        if (!planId || !planName || !planCredits) {
          throw new Error('Invalid plan', {
            cause: {
              subscription,
            },
          });
        }

        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1);
        nextReset.setDate(nextReset.getDate() + 1);

        await prisma.user.update({
          where: { id: Number(ctx.user.id) },
          data: {
            subscriptionPlanId: planId,
            subscriptionPlanName: planName,
            subscriptionActive: true,
            subscriptionCredits: planCredits,
            subscriptionCreditResetDate: nextReset.toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });

        const parsedUserId = Number(ctx.user.id);
        // Create order record
        await prisma.payments.create({
          data: {
            userId: parsedUserId,
            paymentId: paymentId,
          },
        });

        return { success: true, message: 'Subscription verified successfully' };
      } catch (error: unknown) {
        if (IS_PRODUCTION) {
          sendErrorEmail({ error });
        } else {
          console.log('Error in verifyRazorpaySubscription:', error);
        }
        return { success: false, message: 'Failed to verify subscription' };
      }
    }),
});
