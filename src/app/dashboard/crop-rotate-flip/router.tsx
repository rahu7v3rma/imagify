import { prisma } from "@/lib/prisma";
import { router, imageProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { sendErrorEmail } from "@/lib/email";

export const cropRotateFlipRouter = router({
  cropRotateFlip: imageProcedure
    .input(z.object({}))
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: "User not found" };
        }

        const credits = ctx.user.credits || 0;
        if (credits < CREDIT_REQUIREMENTS.CROP_ROTATE_FLIP) {
          return { success: false, message: "You do not have enough credits." };
        }

        // Deduct credits
        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.CROP_ROTATE_FLIP,
            },
          },
        });

        // Credits deducted successfully
        return {
          success: true,
          message: "Crop Rotate Flip Credits deducted successfully!",
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in crop-rotate-flip:", error);
        }
        return { success: false, message: "Failed to process image." };
      }
    }),
});