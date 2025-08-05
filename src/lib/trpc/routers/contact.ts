import { ERROR_CODES } from "@/constants/api";
import { prisma } from "@/lib/prisma";
import { ContactFormDataSchema } from "@/schemas/trpc/contact";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../init";
import { uploadContactFile } from "@/lib/upload";

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
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        });
      }
    }),
});
