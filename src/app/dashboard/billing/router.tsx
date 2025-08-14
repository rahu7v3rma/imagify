import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { paypalOrdersController } from "@/lib/paypal";
import {
  CheckoutPaymentIntent,
  OrderRequest,
  OrderApplicationContextShippingPreference,
} from "@paypal/paypal-server-sdk";

const AmountSchema = z.object({
  amount: z
    .number()
    .min(1, "Amount must be at least $1")
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

        const { result } = await paypalOrdersController.createOrder({
          body: orderPayload,
        });

        const approvalLink =
          result.links?.find((link) => link.rel === "approve")?.href || null;

        if (!approvalLink) {
          return {
            success: false,
            message: "Failed to generate payment URL",
            data: null,
          };
        }

        return {
          success: true,
          message: "Order created successfully",
          data: {
            paymentUrl: approvalLink,
          },
        };
      } catch (_error) {
        return {
          success: false,
          message: "Failed to create order",
          data: null,
        };
      }
    }),
});
