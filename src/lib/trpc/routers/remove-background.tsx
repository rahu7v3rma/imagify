import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { getReplicateImageUrl } from '@/lib/replicate';
import { imageProcedure, router } from '@/lib/trpc/init';
import { convertImageUrlToBase64 } from '@/utils/common';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const removeBackgroundRouter = router({
  removeBackground: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, 'Image is required')
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            'Invalid image format. Only JPEG, JPG, PNG, and WebP are supported',
          ),
        generateType: z.enum(['fast', 'standard']).default('fast'),
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

        const requiredCredits = CREDIT_REQUIREMENTS.REMOVE_BACKGROUND;

        verifyCredits(ctx.user, requiredCredits);

        const replicateInput = {
          image: input.imageBase64,
        };

        const model =
          input.generateType === 'standard'
            ? 'men1scus/birefnet:f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7'
            : '851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc';

        const replicateImageUrl = await getReplicateImageUrl(
          model,
          replicateInput,
        );

        const replicateImageBase64 =
          await convertImageUrlToBase64(replicateImageUrl);

        await deductCredits(ctx.user, requiredCredits);

        return {
          success: true,
          message: 'Background removed successfully!',
          data: {
            imageBase64: replicateImageBase64.base64,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
