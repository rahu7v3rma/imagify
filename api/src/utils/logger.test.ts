import chalk from 'chalk';
import { logError, logInfo } from './logger';

const mockConsoleError = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});
const mockConsoleInfo = jest
  .spyOn(console, 'info')
  .mockImplementation(() => {});

beforeEach(() => {
  mockConsoleError.mockClear();
  mockConsoleInfo.mockClear();
});

describe('logError', () => {
  it('should log an error message with a timestamp', () => {
    const message = 'Test error message';
    const now = new Date();
    logError(message);
    expect(mockConsoleError).toHaveBeenCalledWith(
      chalk.red(`[ERROR] ${now.toISOString()} - ${message}`),
    );
  });

  it('should log an error object if provided', () => {
    const message = 'Test error message';
    const now = new Date();
    const error = new Error('Test error');
    logError(message, error);
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
    expect(mockConsoleError).toHaveBeenCalledWith(
      chalk.red(`[ERROR] ${now.toISOString()} - ${message}`),
    );
    expect(mockConsoleError).toHaveBeenCalledWith(chalk.red(error));
  });
});

describe('logInfo', () => {
  it('should log an info message with a timestamp', () => {
    const message = 'Test info message';
    const now = new Date();
    logInfo(message);
    expect(mockConsoleInfo).toHaveBeenCalledWith(
      chalk.blue(`[INFO] ${now.toISOString()} - ${message}`),
    );
  });
});
