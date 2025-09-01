import { CONTACT_EMAIL, ADMIN_EMAIL } from '@/constants/common';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const mailOptions = {
    from: CONTACT_EMAIL,
    to,
    subject,
    html,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function sendEmailVerificationEmail({
  to,
  emailVerificationCode,
}: {
  to: string;
  emailVerificationCode: string;
}) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?email=${to}&code=${emailVerificationCode}`;

  const subject = 'Verify Your Email Address';

  const html = `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`;

  const text = `Click ${verificationUrl} to verify your email address.`;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}

export async function sendForgotPasswordEmail({
  to,
  verificationCode,
}: {
  to: string;
  verificationCode: string;
}) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/change-password?email=${to}&code=${verificationCode}`;

  const subject = 'Reset Your Password';

  const html = `<p>Click <a href="${verificationUrl}">here</a> to reset your password.</p>`;

  const text = `Click ${verificationUrl} to reset your password.`;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}

export async function sendErrorEmail({ error }: { error: any }) {
  const subject = 'Application Error Report';

  const errorMessage = error?.message || 'Unknown error';
  const errorString = JSON.stringify(error, null, 2);
  const errorCause = error?.cause || 'No cause provided';

  const html = `
    <h2>Application Error Report</h2>
    <p>Error Message: ${errorMessage}</p>
    <p>Error Cause: ${errorCause}</p>
    <pre>${errorString}</pre>
  `;

  const text = `Application Error Report:\n\n${errorMessage}\n\n${errorCause}\n\n${errorString}`;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
    text,
  });
}
