import { prisma } from "@/lib/prisma";
import { router, imageProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { sendErrorEmail } from "@/lib/email";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { resizeImage } from "@/lib/image-processing";

export const resizeImageRouter = router({
  resizeImage: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, "Image is required")
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            "Invalid image format. Only JPEG, JPG, PNG, and WebP are supported"
          ),
        width: z
          .number()
          .min(1, "Width must be at least 1 pixel")
          .max(5000, "Width cannot exceed 5000 pixels"),
        height: z
          .number()
          .min(1, "Height must be at least 1 pixel")
          .max(5000, "Height cannot exceed 5000 pixels"),
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
        if (credits < CREDIT_REQUIREMENTS.RESIZE_IMAGE) {
          return { success: false, message: "You do not have enough credits." };
        }

        // Resize the image using image processing API
        const response = await resizeImage(
          input.imageBase64,
          input.width,
          input.height
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.RESIZE_IMAGE,
            },
          },
        });

        return {
          success: true,
          message: "Image resized successfully!",
          data: {
            imageBase64: response.data.imageBase64,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in resize image:", error);
        }
        return { success: false, message: "Failed to resize image." };
      }
    }),
});
