import { logError, logInfo } from '@/utils/logger';

export const initApp = async () => {
  try {
    logInfo('App started successfully');
  } catch (error: unknown) {
    logError('Failed to start app:', error);
  }
};
