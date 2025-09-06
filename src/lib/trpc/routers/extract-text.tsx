import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { extractText } from '@/lib/image/extract-text';
import { imageProcedure, router } from '@/lib/trpc/init';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const extractTextRouter = router({
  extractText: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, 'Image is required')
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            'Invalid image format. Only JPEG, JPG, PNG, and WebP are supported',
          ),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            extractedText: z.string(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const requiredCredits = CREDIT_REQUIREMENTS.EXTRACT_TEXT;

        verifyCredits(ctx.user, requiredCredits);

        // Extract text using image processing API
        const response = await extractText(input.imageBase64);

        await deductCredits(ctx.user, requiredCredits);

        return {
          success: true,
          message: 'Text extracted successfully!',
          data: {
            extractedText: response.text,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
