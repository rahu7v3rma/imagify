import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";

export const settingsRouter = router({
  deleteAccount: protectedProcedure
    .output(z.boolean())
    .mutation(async ({ ctx }) => {
      try {
        const email = ctx.user?.email;

        if (email) {
          await prisma.user.delete({
            where: { email },
          });
        }

        return true;
      } catch (error) {
        return false;
      }
    }),
});
