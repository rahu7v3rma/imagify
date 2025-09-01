import { prisma } from '@/lib/prisma';
import { router, imageProcedure } from '@/lib/trpc/init';
import { z } from 'zod';
import { sendErrorEmail } from '@/lib/email';
import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { compressImage } from '@/lib/image/compress-image';

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

        const credits = ctx.user.credits || 0;
        if (credits < CREDIT_REQUIREMENTS.COMPRESS_IMAGE) {
          return { success: false, message: 'You do not have enough credits.' };
        }

        // Compress the image using image processing API
        const response = await compressImage(input.imageBase64, input.quality);

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.COMPRESS_IMAGE,
            },
          },
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
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in compress image:', error);
        }
        return { success: false, message: 'Failed to compress image.' };
      }
    }),
});
