import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: true,
});

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return info;
};

export const sendEmailVerificationEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const subject = "Email Verification";
  const text = `Your email verification link is ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?email=${email}&code=${code}`;
  await sendEmail({ to: email, subject, text });
};
