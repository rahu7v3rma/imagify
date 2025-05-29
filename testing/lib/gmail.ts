import { google } from "googleapis";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN,
} from "../utils/env";

const gmail = google.gmail("v1");

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN,
});

const getLatestEmail = async () => {
  const res = await gmail.users.messages.list({
    userId: "me",
    auth: oauth2Client,
  });

  const messageId = res.data.messages?.[0]?.id;

  const message = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    auth: oauth2Client,
    format: "full",
  });

  const subject = message.data.payload?.headers?.find(
    (header) => header.name === "Subject"
  )?.value;

  const body = message.data.payload?.body?.data;

  const decodedBody = Buffer.from(body, "base64").toString("utf-8");

  return { subject, body: decodedBody };
};

export default {
  getLatestEmail,
}