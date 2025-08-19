import { z } from "zod";

export const sendUpworkEmailRequestBody = z.object({
  subject: z.string().min(1).max(100),
  html: z.string().min(1).max(10000)
});

export const sendBeehiveEmailRequestBody = z.object({
  subject: z.string().min(1).max(100),
  html: z.string().min(1).max(10000)
});

export const compressImageRequestBody = z.object({
  imageBase64: z.string()
    .min(1, "Base64 image is required")
    .regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, "Invalid image format. Only JPEG, JPG, PNG, and WebP are supported"),
  quality: z.number().min(1).max(100)
});