import { z } from "zod";

export const ContactSchema = z.object({
  email: z.email(),
  message: z.string().min(10).max(1000),
  image: z.instanceof(File).optional(),
});
