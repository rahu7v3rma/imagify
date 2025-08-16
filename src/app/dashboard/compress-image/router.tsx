import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { sendErrorEmail } from "@/lib/email";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { compressBase64Image } from "@/lib/tinify";

export const compressImageRouter = router({
  compressImage: protectedProcedure
    .input(
      z.object({
        imageBase64: z.string().min(1, "Image is required"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            imageBase64: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: "User not found" };
        }

        const credits = ctx.user.credits || 0;
        if (credits < CREDIT_REQUIREMENTS.COMPRESS_IMAGE) {
          return { success: false, message: "You do not have enough credits." };
        }

        // Compress the image using tinify
        const compressedImageBase64 = await compressBase64Image(
          input.imageBase64
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.COMPRESS_IMAGE,
            },
          },
        });

        return {
          success: true,
          message: "Image compressed successfully!",
          data: {
            imageBase64: compressedImageBase64,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in compress image:", error);
        }
        return { success: false, message: "Failed to compress image." };
      }
    }),
});