import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { hashPassword, comparePassword } from "@/utils/bcrypt";

export const settingsRouter = router({
  deleteAccount: protectedProcedure
    .output(z.boolean())
    .mutation(async ({ ctx }) => {
      try {
        if (!ctx.user) {
          return false;
        }
        const email = ctx.user.email;

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
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: "User not found" };
        }

        const isPasswordCorrect = await comparePassword({
          password: input.currentPassword,
          hashedPassword: ctx.user.password,
        });
        if (!isPasswordCorrect) {
          return { success: false, message: "Current password is incorrect" };
        }

        const hashedPassword = await hashPassword({
          password: input.newPassword,
        });
        await prisma.user.update({
          where: { email: ctx.user.email },
          data: { password: hashedPassword },
        });

        return { success: true, message: "Password changed successfully" };
      } catch (error) {
        return { success: false, message: "Failed to change password" };
      }
    }),
});
