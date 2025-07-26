import admin from "firebase-admin";
// import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
// import {
//   applyActionCode,
//   checkActionCode,
//   confirmPasswordReset,
//   createUserWithEmailAndPassword,
//   deleteUser,
//   getAuth,
//   onAuthStateChanged,
//   sendPasswordResetEmail,
//   sendEmailVerification,
//   signInWithEmailAndPassword,
//   signOut,
//   verifyBeforeUpdateEmail,
//   verifyPasswordResetCode,
// } from "firebase/auth";
// import {
//   collection,
//   getDocs,
//   getFirestore,
//   query,
//   updateDoc,
//   where,
//   addDoc,
//   setDoc,
//   doc,
//   getDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   StringFormat,
//   uploadBytes,
//   UploadMetadata,
//   uploadString,
// } from "firebase/storage";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
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
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Get instances
const db = admin.firestore();
const storage = admin.storage();

// Admin Storage functions
export const uploadFile = async (
  fileBuffer: Buffer | Uint8Array,
  filePath: string,
  metadata?: { [key: string]: string },
) => {
  const bucket = storage.bucket();
  const file = bucket.file(filePath);

  const options = {
    metadata: {
      metadata: metadata || {},
    },
  };

  await file.save(fileBuffer, options);
  return file;
};

export const getFileDownloadURL = async (filePath: string) => {
  const bucket = storage.bucket();
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
export const getUserCredits = async (
  userId: string,
): Promise<UserCreditsDocument | null> => {
  const docRef = db.collection("user_credits").doc(userId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data() as UserCreditsDocument;
  } else {
    return null;
  }
};

export const updateUserCredits = async (
  userId: string,
  credits: number,
): Promise<void> => {
  const docRef = db.collection("user_credits").doc(userId);
  await docRef.update({
    credits: credits,
  });
};

export const deleteUserCredits = async (userId: string): Promise<void> => {
  const docRef = db.collection("user_credits").doc(userId);
  await docRef.delete();
};

export const createUserCredits = async (
  userId: string,
  initialCredits: number = 0,
): Promise<void> => {
  const userCreditsData: UserCreditsDocument = {
    credits: initialCredits,
  };

  await db.collection("user_credits").doc(userId).set(userCreditsData);
};

// Admin User Transaction functions
export const createUserTransaction = async (
  paymentLinkId: string,
  userId: string,
  status: string,
): Promise<void> => {
  const transactionData: UserTransactionDocument = {
    status,
    userId,
    createdAt: new Date().toISOString(),
  };

  await db.collection("user_transactions").doc(paymentLinkId).set(transactionData);
};

export const getUserTransaction = async (
  paymentLinkId: string,
): Promise<UserTransactionDocument | null> => {
  const docRef = db.collection("user_transactions").doc(paymentLinkId);
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
export const getExchangeRates =
  async (): Promise<ExchangeRateData | null> => {
    try {
      // Get the most recent exchange rate document by ordering by document ID (timestamp) in descending order
      const snapshot = await db
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

// export const createUser = (email: string, password: string) => {
//   return createUserWithEmailAndPassword(auth, email, password);
// };

// export const loginUser = (email: string, password: string) => {
//   return signInWithEmailAndPassword(auth, email, password);
// };

// export const listenAuthState = (
//   callback: Parameters<typeof onAuthStateChanged>[1],
// ) => {
//   return onAuthStateChanged(auth, callback);
// };

// export const logoutUser = () => {
//   return signOut(auth);
// };

// export const resetPasswordEmail = (email: string) => {
//   return sendPasswordResetEmail(auth, email);
// };

// export const sendVerificationEmail = (user: any) => {
//   return sendEmailVerification(user);
// };

// export const deleteCurrentUser = () => {
//   if (!auth.currentUser) {
//     throw new Error("No user is currently authenticated");  
//   }
//   return deleteUser(auth.currentUser);
// };

// export const handleActionCode = async (oobCode: string) => {
//   return checkActionCode(auth, oobCode);
// };

// export const applyAuthActionCode = async (oobCode: string) => {
//   return applyActionCode(auth, oobCode);
// };

// export const verifyPasswordResetCodeFunc = async (oobCode: string) => {
//   return verifyPasswordResetCode(auth, oobCode);
// };

// export const confirmPasswordResetFunc = async (oobCode: string, newPassword: string) => {
//   return confirmPasswordReset(auth, oobCode, newPassword);
// };

// export const updateUserEmail = async (newEmail: string) => {
//   if (!auth.currentUser) {
//     throw new Error("No user is currently authenticated");
//   }
//   return verifyBeforeUpdateEmail(auth.currentUser, newEmail);
// };

// // Storage functions
// export const uploadFile = async (
//   file: File | Blob | Uint8Array | ArrayBuffer,
//   path: string,
//   metadata?: UploadMetadata,
// ) => {
//   const storageRef = ref(storage, path);
//   const uploadTask = uploadBytes(storageRef, file, metadata);
//   return uploadTask;
// };

// export const uploadFileString = async (
//   value: string,
//   path: string,
//   format?: StringFormat,
//   metadata?: UploadMetadata,
// ) => {
//   const storageRef = ref(storage, path);
//   return uploadString(storageRef, value, format, metadata);
// };

// export const getFileDownloadURL = async (path: string) => {
//   const storageRef = ref(storage, path);
//   return getDownloadURL(storageRef);
// };

// export const createStorageRef = (path: string) => {
//   return ref(storage, path);
// };

// // Firestore types
// export interface UserCreditsDocument {
//   credits: number;
// }

// export interface UserRoleDocument {
//   role_name: string;
// }

// export interface ContactMessage {
//   email: string;
//   message: string;
// }

// // Firestore functions
// export const getUserCredits = async (
//   userId: string,
// ): Promise<UserCreditsDocument | null> => {
//   const docRef = doc(db, "user_credits", userId);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     return docSnap.data() as UserCreditsDocument;
//   } else {
//     return null;
//   }
// };

// export const getUserRole = async (
//   userId: string,
// ): Promise<UserRoleDocument | null> => {
//   const docRef = doc(db, "user_role", userId);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     return docSnap.data() as UserRoleDocument;
//   } else {
//     return null;
//   }
// };

// export const createUserCredits = async (
//   userId: string,
//   initialCredits: number = 0,
// ): Promise<void> => {
//   const userCreditsData: UserCreditsDocument = {
//     credits: initialCredits,
//   };

//   await setDoc(doc(db, "user_credits", userId), userCreditsData);
// };

// export const updateUserCredits = async (
//   userId: string,
//   credits: number,
// ): Promise<void> => {
//   const docRef = doc(db, "user_credits", userId);
//   await updateDoc(docRef, {
//     credits: credits,
//   });
// };

// export const deleteUserCredits = async (userId: string): Promise<void> => {
//   const docRef = doc(db, "user_credits", userId);
//   await deleteDoc(docRef);
// };

// export const contactUs = async (
//   email: string,
//   message: string,
// ): Promise<void> => {
//   const contactMessageData = {
//     email,
//     message,
//   };

//   await addDoc(collection(db, "contact_us_messages"), contactMessageData);
// };
