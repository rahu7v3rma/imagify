import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com",
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Get instances
const adminDb = admin.firestore();
const adminStorage = admin.storage();

// Admin Storage functions
export const adminUploadFile = async (
  fileBuffer: Buffer | Uint8Array,
  filePath: string,
  metadata?: { [key: string]: string },
) => {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);

  const options = {
    metadata: {
      metadata: metadata || {},
    },
  };

  await file.save(fileBuffer, options);
  return file;
};

export const adminGetFileDownloadURL = async (filePath: string) => {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);

  // Make the file publicly readable and get signed URL
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2500", // Far future date
  });

  return url;
};

// Admin Firestore types
export interface UserCreditsDocument {
  credits: number;
}

// User Transaction types
export interface UserTransactionDocument {
  status: string;
  userId: string;
  createdAt?: string;
}

// Admin Firestore functions
export const adminGetUserCredits = async (
  userId: string,
): Promise<UserCreditsDocument | null> => {
  const docRef = adminDb.collection("user_credits").doc(userId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data() as UserCreditsDocument;
  } else {
    return null;
  }
};

export const adminUpdateUserCredits = async (
  userId: string,
  credits: number,
): Promise<void> => {
  const docRef = adminDb.collection("user_credits").doc(userId);
  await docRef.update({
    credits: credits,
  });
};

export const adminDeleteUserCredits = async (userId: string): Promise<void> => {
  const docRef = adminDb.collection("user_credits").doc(userId);
  await docRef.delete();
};

export const adminCreateUserCredits = async (
  userId: string,
  initialCredits: number = 0,
): Promise<void> => {
  const userCreditsData: UserCreditsDocument = {
    credits: initialCredits,
  };

  await adminDb.collection("user_credits").doc(userId).set(userCreditsData);
};

// Admin User Transaction functions
export const adminCreateUserTransaction = async (
  paymentLinkId: string,
  userId: string,
  status: string,
): Promise<void> => {
  const transactionData: UserTransactionDocument = {
    status,
    userId,
    createdAt: new Date().toISOString(),
  };

  await adminDb.collection("user_transactions").doc(paymentLinkId).set(transactionData);
};

export const adminGetUserTransaction = async (
  paymentLinkId: string,
): Promise<UserTransactionDocument | null> => {
  const docRef = adminDb.collection("user_transactions").doc(paymentLinkId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data() as UserTransactionDocument;
  } else {
    return null;
  }
};

// Admin Exchange Rate types
export interface Currency {
  code: string;
  rate: number;
  label: string;
}

export interface ExchangeRateData {
  currencies: Currency[];
  timestamp: string;
}

// Admin Exchange Rate functions
export const adminGetExchangeRates =
  async (): Promise<ExchangeRateData | null> => {
    try {
      // Get the most recent exchange rate document by ordering by document ID (timestamp) in descending order
      const snapshot = await adminDb
        .collection("exchange_rate")
        .orderBy("__name__", "desc")
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const exchangeRates = doc.data();

      // Transform the data to include currency codes and their rates
      const currencies: Currency[] = Object.entries(exchangeRates).map(
        ([code, rate]) => ({
          code,
          rate: rate as number,
          label: code.toUpperCase(),
        }),
      );

      return {
        currencies,
        timestamp: doc.id,
      };
    } catch (error) {
      return null;
    }
  };

export { admin };
