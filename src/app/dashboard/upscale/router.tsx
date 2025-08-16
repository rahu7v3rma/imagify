import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { sendErrorEmail } from "@/lib/email";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { getReplicateImageUrl } from "@/lib/replicate";
import { convertImageUrlToBase64 } from "@/utils/common";

export const upscaleRouter = router({
  upscale: protectedProcedure
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
        if (credits < CREDIT_REQUIREMENTS.UPSCALE) {
          return { success: false, message: "You do not have enough credits." };
        }

        const replicateInput = {
          image: input.imageBase64,
          scale: 2,
        };

        const replicateImageUrl = await getReplicateImageUrl(
          "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
          replicateInput
        );

        const replicateImageBase64 = await convertImageUrlToBase64(
          replicateImageUrl
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.UPSCALE,
            },
          },
        });

        return {
          success: true,
          message: "Image upscaled successfully!",
          data: {
            imageBase64: replicateImageBase64,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in upscale:", error);
        }
        return { success: false, message: "Failed to upscale image." };
      }
    }),
});