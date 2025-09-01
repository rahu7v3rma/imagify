import { prisma } from '@/lib/prisma';
import { publicProcedure, router } from '@/lib/trpc/init';
import { z } from 'zod';
import { comparePassword } from '@/utils/bcrypt';
import { sendEmailVerificationEmail, sendErrorEmail } from '@/lib/email';
import { generateEmailVerificationCode } from '@/utils/common';
import { generateAccessToken } from '@/utils/jwt';

export const loginRouter = router({
  authenticateUser: publicProcedure
    .input(
      z.object({
        email: z.email('Please enter a valid email address'),
        password: z.string().min(1, 'Password is required'),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            accessToken: z.string(),
          })
          .nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { email, password } = input;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return {
            success: false,
            message: 'Invalid email or password',
            data: null,
          };
        }

        // Check if email is verified
        if (!user.emailVerified) {
          const emailVerificationCode = generateEmailVerificationCode();
          await prisma.user.update({
            where: { id: user.id },
            data: {
              emailVerificationCode,
              updatedAt: new Date().toISOString(),
            },
          });
          sendEmailVerificationEmail({
            to: user.email,
            emailVerificationCode,
          });
          return {
            success: false,
            message:
              'Email not verified, we have sent a verification code to your email',
            data: null,
          };
        }

        // Compare password
        const isPasswordValid = await comparePassword({
          password,
          hashedPassword: user.password,
        });

        if (!isPasswordValid) {
          return {
            success: false,
            message: 'Invalid email or password',
            data: null,
          };
        }

        const accessToken = generateAccessToken({ userId: user.id.toString() });

        return {
          success: true,
          message: 'Login successful',
          data: {
            accessToken,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in login:', error);
        }
        return {
          success: false,
          message: 'Failed to login. Please try again.',
          data: null,
        };
      }
    }),
});
