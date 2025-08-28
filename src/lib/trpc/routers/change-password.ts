import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "@/lib/trpc/init";
import { z } from "zod";
import { hashPassword } from "@/utils/bcrypt";
import { isStrongPassword } from "validator";
import { sendErrorEmail } from "@/lib/email";

export const changePasswordRouter = router({
  changePassword: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        code: z.string(),
        password: z.string().refine(isStrongPassword, {
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { email, code, password } = input;

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email, emailVerificationCode: code },
        });

        if (!user) {
          return {
            success: false,
            message: "Email not exist",
          };
        }

        // Hash the new password
        const hashedPassword = await hashPassword({ password });

        // Update user's password and clear the verification code
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            emailVerificationCode: null,
            updatedAt: new Date().toISOString(),
          },
        });

        return {
          success: true,
          message: "Password changed successfully",
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in change password:', error);
        }
        return {
          success: false,
          message: "Failed to change password. Please try again.",
        };
      }
    }),
});
