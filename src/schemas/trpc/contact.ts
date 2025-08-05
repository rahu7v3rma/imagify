import { z } from "zod";
import { zfd } from "zod-form-data";

export const ContactFormDataSchema = zfd.formData({
  email: zfd.text(z.string().email()),
  message: zfd.text(z.string().min(10).max(1000)),
  image: zfd.file(
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 10 * 1024 * 1024,
        "File size must be less than 10MB"
      )
      .refine((file) => file.type.startsWith("image/"), "File must be an image")
      .optional()
  ),
});