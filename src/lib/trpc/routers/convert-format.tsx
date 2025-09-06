import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { convertFormat } from '@/lib/image/convert-format';
import { imageProcedure, router } from '@/lib/trpc/init';
import { uploadFileToDatabase } from '@/lib/upload';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const convertFormatRouter = router({
  convertFormat: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, 'Image is required')
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            'Invalid image format. Only JPEG, JPG, PNG, and WebP are supported',
          ),
        format: z.string().min(1, 'Format is required'),
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

        const requiredCredits = CREDIT_REQUIREMENTS.CONVERT_FORMAT;

        verifyCredits(ctx.user, requiredCredits);

        // Convert the image format using image processing API
        const response = await convertFormat(input.imageBase64, input.format);

        await deductCredits(ctx.user, requiredCredits);

        await uploadFileToDatabase({
          user: ctx.user,
          base64String: response.imageBase64,
        });

        return {
          success: true,
          message: 'Image format converted successfully!',
          data: {
            imageBase64: response.imageBase64,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
