import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "../../../lib/trpc/init";
import { z } from "zod";
import { generateEmailVerificationCode } from "@/utils/common";
import { sendEmailVerificationEmail } from "@/lib/email";
import { hashPassword } from "@/utils/bcrypt";
import { isStrongPassword } from "validator";

const SignupSchema = z.object({
  email: z.email(),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export const signupRouter = router({
  createUser: publicProcedure
    .input(SignupSchema)
    .mutation(async ({ input }) => {
      try {
        const { email, password } = input;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return {
            success: false,
            message: "User with this email already exists",
          };
        }

        // Hash password
        const hashedPassword = await hashPassword({ password });

        // Generate email verification code
        const emailVerificationCode = generateEmailVerificationCode();

        // Create user
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            emailVerified: false,
            emailVerificationCode,
          },
        });

        // Send verification email
        sendEmailVerificationEmail({
          to: email,
          emailVerificationCode,
        });

        return {
          success: true,
          message:
            "User created successfully, please check your email to verify your account.",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to create user",
        };
      }
    }),
});
