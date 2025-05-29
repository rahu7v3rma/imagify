
import { z } from "zod";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

export const UserRegisterRequestBody = z.object({
  email: z.string().min(1).refine(isEmail, { message: "Invalid email address" }),
  password: z.string().min(1).refine(isStrongPassword, { message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol." }),
});
