import { prisma } from '@/lib/prisma';
import { router, protectedProcedure } from '@/lib/trpc/init';
import { z } from 'zod';
import { hashPassword, comparePassword } from '@/utils/bcrypt';
import { generateEmailVerificationCode } from '@/utils/common';
import { sendEmailVerificationEmail, sendErrorEmail } from '@/lib/email';

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
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const isPasswordCorrect = await comparePassword({
          password: input.currentPassword,
          hashedPassword: ctx.user.password,
        });
        if (!isPasswordCorrect) {
          return { success: false, message: 'Current password is incorrect' };
        }

        const hashedPassword = await hashPassword({
          password: input.newPassword,
        });
        await prisma.user.update({
          where: { email: ctx.user.email },
          data: {
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
          },
        });

        return { success: true, message: 'Password changed successfully' };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in change password:', error);
        }
        return { success: false, message: 'Failed to change password' };
      }
    }),
  changeEmail: protectedProcedure
    .input(
      z.object({
        updatedEmail: z.email('Please enter a valid email address'),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const { updatedEmail } = input;

        // Check if the new email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: updatedEmail },
        });

        if (existingUser) {
          return {
            success: false,
            message: 'Email address is already in use',
          };
        }

        // Generate new email verification code
        const emailVerificationCode = generateEmailVerificationCode();

        // Update user's email and set emailVerified to false
        await prisma.user.update({
          where: { email: ctx.user.email },
          data: {
            email: updatedEmail,
            emailVerified: false,
            emailVerificationCode,
            updatedAt: new Date().toISOString(),
          },
        });

        // Send verification email to the new email address
        sendEmailVerificationEmail({
          to: updatedEmail,
          emailVerificationCode,
        });

        return {
          success: true,
          message:
            'Email changed successfully. Please check your new email to verify your account.',
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in change email:', error);
        }
        return {
          success: false,
          message: 'Failed to change email address',
        };
      }
    }),
});
