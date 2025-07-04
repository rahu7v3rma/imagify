import {
  createUser,
  listenAuthState,
  loginUser,
  logoutUser,
  resetPasswordEmail,
  updateUserEmail,
} from "@/lib/firebase";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLoader } from "./loader";

const FirebaseContext = createContext<{
  user: User | null;
  signup: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<boolean>;
}>({
  user: null,
  signup: async () => false,
  login: async () => false,
  logout: async () => false,
  forgotPassword: async () => false,
  updateEmail: async () => false,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { setIsLoading } = useLoader();

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUser(email, password);
      setUser(userCredential.user);
      addToast({
        title: "Account created successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          addToast({
            title: "Email already in use",
            color: "danger",
          });
          return false;
        }
        if (error.code === "auth/invalid-email") {
          addToast({
            title: "Invalid email",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to create account",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await loginUser(email, password);
      setUser(userCredential.user);
      addToast({
        title: "Logged in successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential") {
          addToast({
            title: "User not found",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to login",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      addToast({
        title: "Logged out successfully!",
        color: "success",
      });
      return true;
    } catch {
      addToast({
        title: "Failed to logout",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await resetPasswordEmail(email);
      addToast({
        title: "Password reset email sent!",
        color: "success",
      });
      return true;
    } catch {
      addToast({
        title: "Failed to send password reset email",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async (email: string) => {
    try {
      setIsLoading(true);
      await updateUserEmail(email);
      addToast({
        title: "Email updated successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/requires-recent-login") {
          addToast({
            title: "Please log in again to update your email",
            color: "danger",
          });
          return false;
        }
        if (error.code === "auth/email-already-in-use") {
          addToast({
            title: "Email already in use",
            color: "danger",
          });
          return false;
        }
        if (error.code === "auth/invalid-email") {
          addToast({
            title: "Invalid email format",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to update email",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = listenAuthState((user) => {
      if (user) {
        setUser(user);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setIsLoading]);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        forgotPassword,
        updateEmail,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
