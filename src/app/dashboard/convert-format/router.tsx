import { prisma } from "@/lib/prisma";
import { router, imageProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { sendErrorEmail } from "@/lib/email";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { convertFormat } from "@/lib/image-processing";

export const convertFormatRouter = router({
  convertFormat: imageProcedure
    .input(
      z.object({
        imageBase64: z.string().min(1, "Image is required").regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, "Invalid image format. Only JPEG, JPG, PNG, and WebP are supported"),
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

        // Convert the image format using image processing API
        const response = await convertFormat(input.imageBase64, input.format);

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
            imageBase64: response.data.imageBase64,
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