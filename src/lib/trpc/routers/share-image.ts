import { router, protectedProcedure } from '@/lib/trpc/init';
import { z } from 'zod';
import { generateShareId } from '@/utils/jwt';
import { USER_SUBSCRIPTION_PLANS } from '@/constants/credits';

export const shareImageRouter = router({
  generateShareUrl: protectedProcedure
    .input(
      z.object({
        fileId: z.number(),
      }),
    )
    .output(
      z.object({
        shareUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { shareUrl: '' };
        }

        if (
          ctx.user.subscriptionPlanName !== USER_SUBSCRIPTION_PLANS.Standard ||
          !ctx.user.subscriptionActive
        ) {
          return { shareUrl: '' };
        }

        const { fileId } = input;
        const userId = ctx.user.id;

        // Generate share ID token using user ID and file ID
        const shareId = generateShareId({
          userId,
          fileId,
        });

        // Create share URL with environment variable
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${shareId}`;

        return {
          shareUrl,
        };
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          // You could add error email sending here if needed
          console.error('Error in generateShareUrl:', error);
        } else {
          console.log('Error in generateShareUrl:', error);
        }
        return { shareUrl: '' };
      }
    }),
});
