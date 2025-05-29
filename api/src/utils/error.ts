import { sendAdminEmail } from "../lib/email";

export const handleError = (errorObject: Record<string, any>) => {
  const errorMessage = JSON.stringify({
    ...errorObject,
    time: new Date().toISOString(),
  });
  sendAdminEmail({
    subject: "internal server error",
    text: errorMessage,
  });
};
