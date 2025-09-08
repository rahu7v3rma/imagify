import { sendErrorEmail } from '@/lib/email';
import { TRPCError } from '@trpc/server';

export const handleTrpcImageProcessingError = (error: any) => {
  if (process.env.APP_ENV === 'production') {
    sendErrorEmail({ error });
  } else {
    console.log('Error in image processing:', error);
  }

  const validErrorMessages = ['You do not have enough credits.'];
  if (validErrorMessages.includes(error.message)) {
    return { success: false, message: error.message };
  }

  return { success: false, message: 'Failed to process image.' };
};

export const handleTrpcError = (error: any, router: string) => {
  if (process.env.APP_ENV === 'production') {
    sendErrorEmail({ error });
  } else {
    console.log(`Error in ${router}:`, error);
  }
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: `Failed to process ${router}.`,
  });
};
