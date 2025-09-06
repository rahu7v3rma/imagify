import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { getReplicateImageUrl } from '@/lib/replicate';
import { protectedProcedure, router } from '@/lib/trpc/init';
import { enhancePrompt } from '@/lib/gemini';
import { uploadFileToDatabase } from '@/lib/upload';
import { convertImageUrlToBase64 } from '@/utils/common';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const generateImageRouter = router({
  enhancePrompt: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .max(1000, 'Prompt must be at most 1000 characters long'),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            enhancedPrompt: z.string(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const requiredCredits = CREDIT_REQUIREMENTS.ENHANCE_PROMPT;

        verifyCredits(ctx.user, requiredCredits);

        const enhancedPrompt = await enhancePrompt(input.prompt);

        await deductCredits(ctx.user, requiredCredits);

        return {
          success: true,
          message: 'Prompt enhanced successfully!',
          data: {
            enhancedPrompt,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),

  generateImage: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .max(1000, 'Prompt must be at most 1000 characters long'),
        generateType: z.enum(['standard', 'pro']).default('standard'),
        outputFormat: z.string().default('png'),
        aspectRatio: z.string().default('1:1'),
      }),
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const requiredCredits =
          CREDIT_REQUIREMENTS.GENERATE_IMAGE[input.generateType];

        verifyCredits(ctx.user, requiredCredits);

        const replicateInput = {
          prompt: input.prompt,
          output_format: input.outputFormat,
          aspect_ratio: input.aspectRatio,
        };

        const model =
          input.generateType === 'pro'
            ? 'black-forest-labs/flux-kontext-pro'
            : 'black-forest-labs/flux-schnell';

        const replicateImageUrl = await getReplicateImageUrl(
          model,
          replicateInput,
        );

        const replicateImageBase64 =
          await convertImageUrlToBase64(replicateImageUrl);

        await deductCredits(ctx.user, requiredCredits);

        await uploadFileToDatabase({
          user: ctx.user,
          base64String: replicateImageBase64.base64,
        });

        return {
          success: true,
          message: 'Image generated successfully!',
          data: {
            imageBase64: replicateImageBase64.base64,
            outputFormat: input.outputFormat,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
