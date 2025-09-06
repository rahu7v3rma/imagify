import { sendErrorEmail } from '@/lib/email';

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
