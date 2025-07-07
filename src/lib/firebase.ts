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
  addDoc
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
export interface UserCreditsDocument {
  user_id: string;
  credits: number;
}

// Firestore functions
export const getUserCredits = async (
  userId: string
): Promise<UserCreditsDocument | null> => {
  const q = query(
    collection(db, "user_credits"),
    where("user_id", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data() as UserCreditsDocument;
    return docData;
  } else {
    return null;
  }
};

export const createUserCredits = async (
  userId: string,
  initialCredits: number = 0
): Promise<void> => {
  const userCreditsData: UserCreditsDocument = {
    user_id: userId,
    credits: initialCredits
  };

  await addDoc(collection(db, "user_credits"), userCreditsData);
};

export const updateUserCredits = async (
  userId: string,
  credits: number
): Promise<void> => {
  const q = query(
    collection(db, "user_credits"),
    where("user_id", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Update existing document
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      credits: credits
    });
  }
};
