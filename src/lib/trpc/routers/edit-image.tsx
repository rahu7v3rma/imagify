import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { getReplicateImageUrl } from '@/lib/replicate';
import { imageProcedure, router } from '@/lib/trpc/init';
import { convertImageUrlToBase64 } from '@/utils/common';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const editImageRouter = router({
  editImage: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, 'Image is required')
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            'Invalid image format. Only JPEG, JPG, PNG, and WebP are supported',
          ),
        prompt: z.string().min(1, 'Prompt is required'),
      }),
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const requiredCredits = CREDIT_REQUIREMENTS.EDIT_IMAGE;

        verifyCredits(ctx.user, requiredCredits);

        const replicateInput = {
          prompt: input.prompt,
          image: input.imageBase64,
        };

        const replicateImageUrl = await getReplicateImageUrl(
          'black-forest-labs/flux-kontext-pro',
          replicateInput,
        );

        const replicateImageBase64 =
          await convertImageUrlToBase64(replicateImageUrl);

        await deductCredits(ctx.user, requiredCredits);

        return {
          success: true,
          message: 'Image edited successfully!',
          data: {
            imageBase64: replicateImageBase64.base64,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
