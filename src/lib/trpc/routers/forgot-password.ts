import { prisma } from '@/lib/prisma';
import { publicProcedure, router } from '@/lib/trpc/init';
import { z } from 'zod';
import { sendForgotPasswordEmail } from '@/lib/email';
import { generateEmailVerificationCode } from '@/utils/common';
import { sendErrorEmail } from '@/lib/email';

export const forgotPasswordRouter = router({
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.email('Please enter a valid email address'),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { email } = input;

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return {
            success: false,
            message: 'Email not exist',
          };
        }

        // Generate email verification code
        const emailVerificationCode = generateEmailVerificationCode();

        // Update user with the verification code
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerificationCode, updatedAt: new Date().toISOString() },
        });

        // Send verification email
        sendForgotPasswordEmail({
          to: user.email,
          verificationCode: emailVerificationCode,
        });

        return {
          success: true,
          message: 'Verification code sent to email',
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in forgot password:', error);
        }
        return {
          success: false,
          message:
            'Failed to process reset password request. Please try again.',
        };
      }
    }),
});
