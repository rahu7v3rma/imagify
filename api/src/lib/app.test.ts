import { logError, logInfo } from '@/utils/logger';
import { initApp } from './app';

jest.mock('@/utils/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

describe('initApp', () => {
  it('should log success message when app starts successfully', async () => {
    await initApp();
    expect(logInfo).toHaveBeenCalledWith('App started successfully');
  });

  it('should log error message when app fails to start', async () => {
    const mockError = {
      message: 'Test error',
      error: new Error('Test error'),
    };
    (logInfo as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    await initApp();
    expect(logError).toHaveBeenCalledWith('Failed to start app:', mockError);
  });
});
