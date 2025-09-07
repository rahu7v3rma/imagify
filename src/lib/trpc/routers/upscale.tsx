import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { getReplicateImageUrl } from '@/lib/replicate';
import { imageProcedure, router } from '@/lib/trpc/init';
import { uploadFileToDatabase } from '@/lib/upload';
import { convertImageUrlToBase64 } from '@/utils/common';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const upscaleRouter = router({
  upscale: imageProcedure
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
            imageBase64: z.string(),
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

        const requiredCredits = CREDIT_REQUIREMENTS.UPSCALE;

        verifyCredits(ctx.user, requiredCredits);

        const replicateInput = {
          image: input.imageBase64,
          scale: 2,
        };

        const replicateImageUrl = await getReplicateImageUrl(
          'nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
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
          message: 'Image upscaled successfully!',
          data: {
            imageBase64: replicateImageBase64.base64,
            fileId: fileId,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
