import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../../lib/trpc/init";
import { uploadContactFile } from "@/lib/upload";
import { z } from "zod";
import { zfd } from "zod-form-data";

const ContactFormDataSchema = zfd.formData({
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

export const contactRouter = router({
  postFormData: publicProcedure
    .input(ContactFormDataSchema)
    .mutation(async ({ input }) => {
      try {
        const { email, message, image } = input;

        let imagePath = null;
        if (image) {
          imagePath = await uploadContactFile({
            file: image,
            fileName: image.name,
          });
        }

        await prisma.contact.create({
          data: {
            email,
            message,
            imagePath,
          },
        });

        return true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
