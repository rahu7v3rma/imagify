import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../init";
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
        "File size must be less than 10MB",
      )
      .refine((file) => file.type.startsWith("image/"), "File must be an image")
      .optional(),
  ),
});

export const ERROR_CODES = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR" as "INTERNAL_SERVER_ERROR",
};

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
        console.error(error);
        throw new TRPCError({
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        });
      }
    }),
});
