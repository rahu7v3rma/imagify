import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { imageProcedure, router } from '@/lib/trpc/init';
import { deductCredits, verifyCredits } from '@/utils/credits';
import { handleTrpcImageProcessingError } from '@/utils/errors';
import { z } from 'zod';

export const cropRotateFlipRouter = router({
  cropRotateFlip: imageProcedure
    .input(z.object({}))
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: 'User not found' };
        }

        const requiredCredits = CREDIT_REQUIREMENTS.CROP_ROTATE_FLIP;

        verifyCredits(ctx.user, requiredCredits);

        // Deduct credits
        await deductCredits(ctx.user, requiredCredits);

        // Credits deducted successfully
        return {
          success: true,
          message: 'Crop Rotate Flip Credits deducted successfully!',
        };
      } catch (error: any) {
        return handleTrpcImageProcessingError(error);
      }
    }),
});
