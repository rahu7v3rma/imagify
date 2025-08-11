import { CONTACT_EMAIL } from "@/constants/common";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
  react,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactNode;
}) {
  try {
    const response = await resend.emails.send({
      from: CONTACT_EMAIL,
      to,
      subject,
      html,
      text,
      react,
    });

    if (response.error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
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

  const subject = "Verify Your Email Address";

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
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${to}&code=${verificationCode}`;

  const subject = "Reset Your Password";

  const html = `<p>Click <a href="${verificationUrl}">here</a> to reset your password.</p>`;

  const text = `Click ${verificationUrl} to reset your password.`;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}
