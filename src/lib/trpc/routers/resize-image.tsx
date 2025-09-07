import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { resizeImage } from '@/lib/image/resize';
import { imageProcedure, router } from '@/lib/trpc/init';
import { uploadFileToDatabase } from '@/lib/upload';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const resizeImageRouter = router({
  resizeImage: imageProcedure
    .input(
      z.object({
        imageBase64: z
          .string()
          .min(1, 'Image is required')
          .regex(
            /^data:image\/(jpeg|jpg|png|webp);base64,/,
            'Invalid image format. Only JPEG, JPG, PNG, and WebP are supported',
          ),
        width: z
          .number()
          .min(1, 'Width must be at least 1 pixel')
          .max(5000, 'Width cannot exceed 5000 pixels'),
        height: z
          .number()
          .min(1, 'Height must be at least 1 pixel')
          .max(5000, 'Height cannot exceed 5000 pixels'),
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

        const requiredCredits = CREDIT_REQUIREMENTS.RESIZE_IMAGE;

        verifyCredits(ctx.user, requiredCredits);

        // Resize the image using image processing API
        const response = await resizeImage(
          input.imageBase64,
          input.width,
          input.height,
        );

        await deductCredits(ctx.user, requiredCredits);

        const fileId = await uploadFileToDatabase({
          user: ctx.user,
          base64String: response.imageBase64,
        });

        return {
          success: true,
          message: 'Image resized successfully!',
          data: {
            imageBase64: response.imageBase64,
            fileId: fileId,
          },
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
