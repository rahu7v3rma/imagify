import chalk from 'chalk';
import { sendAdminEmail } from '@/lib/nodemailer';

export const logError = (message: string, error?: any) => {
  const errorMessage = `[ERROR] ${new Date().toISOString()} - ${message}`;
  console.error(chalk.red(errorMessage));
  if (error) {
    console.error(chalk.red(error));
  }
  
  const errorEmailMessage = JSON.stringify({
    message: errorMessage,
    error: error ? (typeof error === 'object' ? JSON.stringify(error) : error) : undefined
  }, null, 2);
  
  sendAdminEmail('Error Report', errorEmailMessage);
};

export const logInfo = (message: any) => {
  const infoMessage = `[INFO] ${new Date().toISOString()} - ${message}`;
  console.info(chalk.blue(infoMessage));
};
