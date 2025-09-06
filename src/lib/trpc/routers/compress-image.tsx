import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { compressImage } from '@/lib/image/compress-image';
import { imageProcedure, router } from '@/lib/trpc/init';
import { uploadFileToDatabase } from '@/lib/upload';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const compressImageRouter = router({
  compressImage: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, 'Image is required')
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            'Invalid image format. Only JPEG, JPG, PNG, and WebP are supported',
          ),
        quality: z.number().min(1).max(100),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            imageBase64: z.string(),
            compressedSize: z.string().optional(),
            originalSize: z.string().optional(),
            format: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const requiredCredits = CREDIT_REQUIREMENTS.COMPRESS_IMAGE;

        verifyCredits(ctx.user, requiredCredits);

        // Compress the image using image processing API
        const response = await compressImage(input.imageBase64, input.quality);

        await deductCredits(ctx.user, requiredCredits);

        await uploadFileToDatabase({
          user: ctx.user,
          base64String: response.dataUri,
        });

        return {
          success: true,
          message: 'Image compressed successfully!',
          data: {
            imageBase64: response.dataUri,
            compressedSize: response.compressedSize,
            originalSize: response.originalSize,
            format: response.format,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
