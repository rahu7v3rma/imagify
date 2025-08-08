import nodemailer from "nodemailer";

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
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });

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
