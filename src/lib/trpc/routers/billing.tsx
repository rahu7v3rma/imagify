import { IS_PRODUCTION } from "@/constants/common";
import { BILLING_CONSTANTS } from "@/constants/credits";
import { sendErrorEmail } from "@/lib/email";
import {
  createStandardPlanSubscription,
  paypalOrdersController,
} from "@/lib/paypal";
import { protectedProcedure, router } from "@/lib/trpc/init";
import {
  CheckoutPaymentIntent,
  OrderApplicationContextShippingPreference,
  OrderRequest,
} from "@paypal/paypal-server-sdk";
import { z } from "zod";

const AmountSchema = z.object({
  amount: z
    .number()
    .min(
      BILLING_CONSTANTS.MIN_CREDITS / 100,
      `Amount must be at least $${BILLING_CONSTANTS.MIN_CREDITS / 100}`
    )
    .max(100, "Amount must be at most $100"),
});

const CreateOrderOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      paymentUrl: z.string().url(),
    })
    .nullable(),
});

const CreateSubscriptionOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      approvalUrl: z.string().url(),
    })
    .nullable(),
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
            message: "Unauthorized",
            data: null,
          };
        }

        const { amount } = input;

        const orderPayload: OrderRequest = {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              amount: {
                currencyCode: "USD",
                value: String(amount),
              },
              customId: ctx.user.id.toString(),
            },
          ],
          applicationContext: {
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/capture-order`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?buy_credits_failure=1`,
            shippingPreference:
              OrderApplicationContextShippingPreference.NoShipping,
          },
        };

        const order = await paypalOrdersController.createOrder({
          body: orderPayload,
        });

        const approvalLink =
          order.result.links?.find((link) => link.rel === "approve")?.href ||
          null;

        if (!approvalLink) {
          throw new Error("Failed to generate payment URL", {
            cause: order,
          });
        }

        return {
          success: true,
          message: "Order created successfully",
          data: {
            paymentUrl: approvalLink,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in billing create order:", error);
        }
        return {
          success: false,
          message: "Failed to create order",
          data: null,
        };
      }
    }),
  createSubscription: protectedProcedure
    .output(CreateSubscriptionOutputSchema)
    .mutation(async ({ ctx }) => {
      try {
        if (!ctx.user) {
          return {
            success: false,
            message: "Unauthorized",
            data: null,
          };
        }

        const subscription = await createStandardPlanSubscription({
          customId: ctx.user.id.toString(),
        });

        return {
          success: true,
          message: "Subscription created successfully",
          data: {
            approvalUrl: subscription.approvalUrl,
          },
        };
      } catch (error: any) {
        if (IS_PRODUCTION) {
          sendErrorEmail({ error });
        } else {
          console.log("Error in billing create subscription:", error);
        }
        return {
          success: false,
          message: "Failed to create subscription",
          data: null,
        };
      }
    }),
});
