import { z } from "zod";
import { isStrongPassword } from "validator";
import { SIGNUP_SCHEMA_ERRORS } from "../constants/zod-schema";

export const envSchema = z.object({
  PORT: z.string().transform(Number),
  MONGO_URI: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
});

export const signupSchema = z.object({
  email: z.email({ message: SIGNUP_SCHEMA_ERRORS.EMAIL_INVALID }),
  password: z.string().refine(isStrongPassword, {
    message: SIGNUP_SCHEMA_ERRORS.PASSWORD_INVALID,
  }),
});
