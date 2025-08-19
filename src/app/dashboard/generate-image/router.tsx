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
        generateType: z.enum(["standard", "pro"]).default("standard"),
        outputFormat: z.string().default("png"),
        aspectRatio: z.string().default("1:1"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            imageBase64: z.string(),
            outputFormat: z.string(),
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
        const requiredCredits = CREDIT_REQUIREMENTS.GENERATE_IMAGE[input.generateType];
        if (credits < requiredCredits) {
          return { success: false, message: "You do not have enough credits." };
        }

        const replicateInput = {
          prompt: input.prompt,
          output_format: input.outputFormat,
          aspect_ratio: input.aspectRatio,
        };

        const model = input.generateType === "pro" 
          ? "black-forest-labs/flux-kontext-pro" 
          : "black-forest-labs/flux-schnell";

        const replicateImageUrl = await getReplicateImageUrl(
          model,
          replicateInput
        );

        const replicateImageBase64 = await convertImageUrlToBase64(
          replicateImageUrl
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: requiredCredits,
            },
          },
        });

        return {
          success: true,
          message: "Image generated successfully!",
          data: {
            imageBase64: replicateImageBase64.base64,
            outputFormat: input.outputFormat,
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
