import { isStrongPassword } from "validator";
import { z } from "zod";

export const ContactUsSchema = z.object({
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
  attachment: z.instanceof(File),
});

export const EmailVerificationCodeSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const ProfileSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().min(1, "Email is required").optional(),
    password: z
      .string()
      .refine(isStrongPassword, {
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      })
      .optional(),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .refine(
        isStrongPassword,
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ResetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email"),
    emailVerificationCode: z
      .string()
      .min(1, "Email verification code is required"),
    password: z
      .string()
      .refine(
        isStrongPassword,
        "Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const VerifyEmailSchema = z.object({
  email: z.string().email("Invalid email"),
  emailVerificationCode: z.string(),
});
