import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { getReplicateImageUrl, replicate } from '@/lib/replicate';
import { protectedProcedure, router } from '@/lib/trpc/init';
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

        const output = await replicate.run('openai/gpt-5-nano', {
          input: {
            prompt: `You are an AI assistant specialized in enhancing user prompts to make them more detailed, specific, and effective. Take the following user prompt and enhance it to be more comprehensive while maintaining the original intent. Return ONLY the enhanced prompt, nothing else:

"${input.prompt}"`,
          },
        });

        const enhancedPrompt = (output as any).join('');

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
            fileId: z.number().nullable(),
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

        const fileId = await uploadFileToDatabase({
          user: ctx.user,
          base64String: replicateImageBase64.base64,
        });

        return {
          success: true,
          message: 'Image generated successfully!',
          data: {
            imageBase64: replicateImageBase64.base64,
            outputFormat: input.outputFormat,
            fileId: fileId,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
