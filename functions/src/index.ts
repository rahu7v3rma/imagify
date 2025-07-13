/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import axios from "axios";

// Define the secrets
const exchangeRateApiKey = defineSecret("EXCHANGE_RATE_API_KEY");
const firebasePrivateKeyId = defineSecret("IMAGIFY_FIREBASE_PRIVATE_KEY_ID");
const firebasePrivateKey = defineSecret("IMAGIFY_FIREBASE_PRIVATE_KEY");
const firebaseClientEmail = defineSecret("IMAGIFY_FIREBASE_CLIENT_EMAIL");
const firebaseClientId = defineSecret("IMAGIFY_FIREBASE_CLIENT_ID");
const firebaseProjectId = defineSecret("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
const firebaseStorageBucket = defineSecret(
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
);

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    const serviceAccount = {
      type: "service_account",
      project_id: firebaseProjectId.value(),
      private_key_id: firebasePrivateKeyId.value(),
      private_key: firebasePrivateKey.value()?.replace(/\\n/g, "\n"),
      client_email: firebaseClientEmail.value(),
      client_id: firebaseClientId.value(),
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${firebaseClientEmail.value()}`,
      universe_domain: "googleapis.com",
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: firebaseStorageBucket.value(),
    });
  }

  return admin.firestore();
}

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 1 });

// Interface for exchange rate API response
interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

// Scheduled Exchange Rate Update function - runs automatically, not publicly accessible
export const updateExchangeRate = onSchedule(
  {
    schedule: "0 0 * * *", // Run at midnight every day
    timeZone: "UTC",
    secrets: [
      exchangeRateApiKey,
      firebasePrivateKeyId,
      firebasePrivateKey,
      firebaseClientEmail,
      firebaseClientId,
      firebaseProjectId,
      firebaseStorageBucket,
    ],
  },
  async (event) => {
    try {
      logger.info("Starting scheduled exchange rate update", {
        structuredData: true,
      });

      // Initialize Firebase Admin and get Firestore instance
      const db = initializeFirebaseAdmin();

      // Get the API key from Secret Manager
      const apiKey = exchangeRateApiKey.value();

      // Check if EXCHANGE_RATE_API_KEY is available
      if (!apiKey) {
        logger.error("EXCHANGE_RATE_API_KEY secret is not set");
        throw new Error("EXCHANGE_RATE_API_KEY secret is not set");
      }

      // Fetch exchange rates from the API
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

      logger.info(`Fetching exchange rates from: ${apiUrl}`);

      const apiResponse = await axios.get<ExchangeRateResponse>(apiUrl);

      if (apiResponse.data.result !== "success") {
        logger.error("Failed to fetch exchange rates", {
          result: apiResponse.data.result,
        });
        throw new Error("Failed to fetch exchange rates from API");
      }

      // Use the API's timestamp as document ID (epoch time)
      const documentId = apiResponse.data.time_last_update_unix.toString();

      // Prepare the document data
      const exchangeRateData = {
        ...apiResponse.data.conversion_rates,
      };

      // Save to Firestore
      await db
        .collection("exchange_rate")
        .doc(documentId)
        .set(exchangeRateData);

      logger.info(
        `Exchange rates updated successfully with document ID: ${documentId}`,
        {
          documentId: documentId,
          timestamp: apiResponse.data.time_last_update_unix,
          currencyCount: Object.keys(apiResponse.data.conversion_rates).length,
        },
      );
    } catch (error) {
      logger.error("Error updating exchange rates", { error });
      throw error;
    }
  },
);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
