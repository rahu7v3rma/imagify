import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { sendErrorEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { extractText } from '@/lib/image/extract-text';
import { imageProcedure, router } from '@/lib/trpc/init';
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

        const credits = ctx.user.credits || 0;
        if (credits < CREDIT_REQUIREMENTS.EXTRACT_TEXT) {
          return { success: false, message: 'You do not have enough credits.' };
        }

        // Extract text using image processing API
        const response = await extractText(input.imageBase64);

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.EXTRACT_TEXT,
            },
          },
        });

        return {
          success: true,
          message: 'Text extracted successfully!',
          data: {
            extractedText: response.text,
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in extract text:', error);
        }
        return { success: false, message: 'Failed to extract text.' };
      }
    }),
});
