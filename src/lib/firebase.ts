import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  StringFormat,
  uploadBytes,
  UploadMetadata,
  uploadString,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const createUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const listenAuthState = (
  callback: Parameters<typeof onAuthStateChanged>[1]
) => {
  return onAuthStateChanged(auth, callback);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const resetPasswordEmail = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const deleteCurrentUser = () => {
  if (!auth.currentUser) {
    throw new Error("No user is currently authenticated");
  }
  return deleteUser(auth.currentUser);
};

// Storage functions
export const uploadFile = async (
  file: File | Blob | Uint8Array | ArrayBuffer,
  path: string,
  metadata?: UploadMetadata
) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytes(storageRef, file, metadata);
  return uploadTask;
};

export const uploadFileString = async (
  value: string,
  path: string,
  format?: StringFormat,
  metadata?: UploadMetadata
) => {
  const storageRef = ref(storage, path);
  return uploadString(storageRef, value, format, metadata);
};

export const getFileDownloadURL = async (path: string) => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

export const createStorageRef = (path: string) => {
  return ref(storage, path);
};

// Firestore types
export interface UserCentsDocument {
  user_id: string;
  cents: number;
}

export interface ContactMessage {
  email: string;
  message: string;
}

// Firestore functions
export const getUserCents = async (
  userId: string
): Promise<UserCentsDocument | null> => {
  const q = query(
    collection(db, "user_cents"),
    where("user_id", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data() as UserCentsDocument;
    return docData;
  } else {
    return null;
  }
};

export const createUserCents = async (
  userId: string,
  initialCents: number = 0
): Promise<void> => {
  const userCentsData: UserCentsDocument = {
    user_id: userId,
    cents: initialCents,
  };

  await addDoc(collection(db, "user_cents"), userCentsData);
};

export const updateUserCents = async (
  userId: string,
  cents: number
): Promise<void> => {
  const q = query(
    collection(db, "user_cents"),
    where("user_id", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Update existing document
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      cents: cents,
    });
  }
};

export const contactUs = async (
  email: string,
  message: string
): Promise<void> => {
  const contactMessageData = {
    email,
    message,
  };

  await addDoc(collection(db, "contact_us_messages"), contactMessageData);
};
