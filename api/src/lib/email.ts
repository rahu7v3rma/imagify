import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  ADMIN_EMAIL,
} from "../utils/env";

function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const transporter = getTransporter();
  return await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
}

export async function sendAdminEmail({
  subject,
  text,
  html,
}: {
  subject: string;
  text: string;
  html?: string;
}) {
  return await sendEmail({
    to: ADMIN_EMAIL,
    subject,
    text,
    html,
  });
}

export async function sendRegistrationEmail({
  to,
  registerEmailConfirmationCode,
}: {
  to: string;
  registerEmailConfirmationCode: string;
}) {
  return await sendEmail({
    to,
    subject: "Socialify email confirmation",
    text: `Your email confirmation code is ${registerEmailConfirmationCode}.`,
  });
}

export async function sendForgotPasswordEmail({
  to,
  forgotPasswordEmailConfirmationCode,
}: {
  to: string;
  forgotPasswordEmailConfirmationCode: string;
}) {
  return await sendEmail({
    to,
    subject: "Socialify forgot password",
    text: `Your forgot password confirmation code is ${forgotPasswordEmailConfirmationCode}.`,
  });
}
