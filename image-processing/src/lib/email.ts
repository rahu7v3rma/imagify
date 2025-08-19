import { Resend } from "resend";
import { env } from "../utils/env";

const resend = new Resend(env.RESEND_API_KEY);

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
  const response = await resend.emails.send({
    from: env.FROM_EMAIL,
    to,
    subject,
    html,
    text,
    react,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return true;
}

export async function sendErrorEmail({ error }: { error: any }) {
  const subject = "Application Error Report";

  const errorMessage = error?.message || "Unknown error";
  const errorString = JSON.stringify(error, null, 2);
  const errorCause = error?.cause || "No cause provided";

  const html = `
    <h2>Application Error Report</h2>
    <p>Error Message: ${errorMessage}</p>
    <p>Error Cause: ${errorCause}</p>
    <pre>${errorString}</pre>
  `;

  const text = `Application Error Report:\n\n${errorMessage}\n\n${errorCause}\n\n${errorString}`;

  return sendEmail({
    to: env.ADMIN_EMAIL,
    subject,
    html,
    text,
  });
}
