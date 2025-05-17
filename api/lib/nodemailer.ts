import nodemailer from "nodemailer";
import env from "@/utils/env";
import { logError, logInfo } from "@/utils/logger";
import chalk from "chalk";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_USER,
      to,
      subject,
      text,
    });
    logInfo(`Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    logError("Failed to send email:", error);
    return null;
  }
};

export const sendAdminEmail = async (subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_USER,
      to: env.ADMIN_EMAIL_ADDRESS,
      subject,
      text,
    });
    const infoMessage = `[INFO] ${new Date().toISOString()} - Email sent successfully to ${env.ADMIN_EMAIL_ADDRESS}`;
    console.info(chalk.blue(infoMessage));
    return info;
  } catch (error) {
    const errorMessage = `[ERROR] ${new Date().toISOString()} - Failed to send admin email:`;
    console.error(chalk.red(errorMessage));
    if (error) {
      console.error(chalk.red(error));
    }
    return null;
  }
};
