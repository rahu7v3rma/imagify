import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { sendErrorEmail } from "@/lib/email";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { convertFormatBase64Image } from "@/lib/tinify";

export const convertFormatRouter = router({
  convertFormat: protectedProcedure
    .input(
      z.object({
        imageBase64: z.string().min(1, "Image is required"),
        format: z.string().min(1, "Format is required"),
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
        if (credits < CREDIT_REQUIREMENTS.CONVERT_FORMAT) {
          return { success: false, message: "You do not have enough credits." };
        }

        // Convert the image format using tinify
        const convertedImageBase64 = await convertFormatBase64Image(
          input.imageBase64,
          input.format
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.CONVERT_FORMAT,
            },
          },
        });

        return {
          success: true,
          message: "Image format converted successfully!",
          data: {
            imageBase64: convertedImageBase64,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in convert format:", error);
        }
        return { success: false, message: "Failed to convert image format." };
      }
    }),
});