import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";

export const userRouter = router({
  getProfile: protectedProcedure
    .output(
      z.object({
        email: z.string().optional(),
        credits: z.number().optional(),
      })
    )
    .query(({ ctx }) => {
      return {
        email: ctx.user?.email,
        credits: ctx.user?.credits,
      };
    }),
});
