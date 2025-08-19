import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { sendErrorEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getReplicateImageUrl } from "@/lib/replicate";
import { protectedProcedure, router } from "@/lib/trpc/init";
import { convertImageUrlToBase64 } from "@/utils/common";
import { z } from "zod";

export const generateImageRouter = router({
  generateImage: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .max(1000, "Prompt must be at most 1000 characters long"),
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
        if (credits < CREDIT_REQUIREMENTS.GENERATE_IMAGE) {
          return { success: false, message: "You do not have enough credits." };
        }

        const replicateInput = {
          prompt: input.prompt,
        };

        const replicateImageUrl = await getReplicateImageUrl(
          "black-forest-labs/flux-schnell",
          replicateInput
        );

        const replicateImageBase64 = await convertImageUrlToBase64(
          replicateImageUrl
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.GENERATE_IMAGE,
            },
          },
        });

        return {
          success: true,
          message: "Image generated successfully!",
          data: {
            imageBase64: replicateImageBase64.base64,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in generate image:', error);
        }
        return { success: false, message: "Failed to generate image." };
      }
    }),
});
