import chalk from 'chalk';

export const logError = (message: string, error?: unknown) => {
  const errorMessage = `[ERROR] ${new Date().toISOString()} - ${message}`;
  console.error(chalk.red(errorMessage));
  if (error) {
    console.error(chalk.red(error));
  }
};

export const logInfo = (message: string) => {
  const infoMessage = `[INFO] ${new Date().toISOString()} - ${message}`;
  console.info(chalk.blue(infoMessage));
};
