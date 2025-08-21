import { z } from "zod";

export const sendUpworkEmailRequestBody = z.object({
  subject: z.string().min(1).max(100),
  html: z.string().min(1).max(10000),
});

export const sendBeehiveEmailRequestBody = z.object({
  subject: z.string().min(1).max(100),
  html: z.string().min(1).max(10000),
});

export const compressImageRequestBody = z.object({
  imageBase64: z
    .string()
    .min(1, "Base64 image is required")
    .regex(
      /^data:image\/(jpeg|jpg|png|webp);base64,/,
      "Invalid image format. Only JPEG, JPG, PNG, and WebP are supported"
    ),
  quality: z.number().min(1).max(100),
});

export const extractTextRequestBody = z.object({
  imageBase64: z
    .string()
    .min(1, "Base64 image is required")
    .regex(
      /^data:image\/(jpeg|jpg|png|webp);base64,/,
      "Invalid image format. Only JPEG, JPG, PNG, WebP are supported"
    ),
});

export const extractTextResponseData = z.object({
  extractedText: z.string(),
});

export const compressImageResponseData = z.object({
  imageBase64: z.string(),
  compressedSize: z.number(),
  originalSize: z.number(),
  format: z.string(),
});

export const convertFormatRequestBody = z.object({
  imageBase64: z
    .string()
    .min(1, "Base64 image is required")
    .regex(
      /^data:image\/(jpeg|jpg|png|webp);base64,/,
      "Invalid image format. Only JPEG, JPG, PNG, and WebP are supported"
    ),
  format: z.enum(["jpeg", "jpg", "png", "webp"]),
});

export const convertFormatResponseData = z.object({
  imageBase64: z.string(),
});

export const resizeImageRequestBody = z.object({
  imageBase64: z
    .string()
    .min(1, "Base64 image is required")
    .regex(
      /^data:image\/(jpeg|jpg|png|webp);base64,/,
      "Invalid image format. Only JPEG, JPG, PNG, and WebP are supported"
    ),
  width: z.number().min(1).max(5000),
  height: z.number().min(1).max(5000),
});

export const resizeImageResponseData = z.object({
  imageBase64: z.string(),
});
