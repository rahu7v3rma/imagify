import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";

export const userRouter = router({
  getProfile: protectedProcedure
    .output(
      z.object({
        email: z.string().optional(),
        credits: z.number().optional(),
        subscriptionPlanName: z.string().nullable().optional(),
        subscriptionCreditResetDate: z.string().nullable().optional(),
        subscriptionCredits: z.number().optional(),
        subscriptionActive: z.boolean().optional(),
      })
    )
    .query(({ ctx }) => {
      return {
        email: ctx.user?.email,
        credits: ctx.user?.credits,
        subscriptionPlanName: ctx.user?.subscriptionPlanName ?? null,
        subscriptionCreditResetDate: ctx.user?.subscriptionCreditResetDate
          ? new Date(ctx.user.subscriptionCreditResetDate).toISOString()
          : null,
        subscriptionCredits: ctx.user?.subscriptionCredits,
        subscriptionActive: ctx.user?.subscriptionActive,
      };
    }),
});
