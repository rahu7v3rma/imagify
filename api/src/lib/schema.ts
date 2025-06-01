import { z } from "zod";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

export const UserRegisterRequestBody = z.object({
  email: z
    .string()
    .min(1)
    .max(255)
    .refine(isEmail, { message: "Invalid email address" }),
  password: z.string().min(1).max(255).refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
  }),
});
export const UserEmailConfirmRequestBody = z.object({
  email: z
    .string()
    .min(1)
    .max(255)
    .refine(isEmail, { message: "Invalid email address" }),
  registerEmailConfirmationCode: z.string().min(1).max(255),
});

export const UserLoginRequestBody = z.object({
  email: z
    .string()
    .min(1)
    .max(255)
    .refine(isEmail, { message: "Invalid email address" }),
  password: z.string().min(1).max(255),
});

export const UserForgotPasswordRequestBody = z.object({
  email: z
    .string()
    .min(1)
    .max(255)
    .refine(isEmail, { message: "Invalid email address" }),
});

export const UserResetPasswordRequestBody = z.object({
  email: z
    .string()
    .min(1)
    .max(255)
    .refine(isEmail, { message: "Invalid email address" }),
  forgotPasswordEmailConfirmationCode: z.string().min(1).max(255),
  password: z.string().min(1).max(255).refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
  }),
});
