import {
  listenAuthState,
  getUserCredits,
  UserCreditsDocument,
} from "@/lib/firebase";
import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLoader } from "./loader";
import Cookies from "js-cookie";

const FirebaseContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  userCredits: UserCreditsDocument | null;
  setUserCredits: (credits: UserCreditsDocument | null) => void;
}>({
  user: null,
  setUser: () => { },
  userCredits: null,
  setUserCredits: () => { },
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userCredits, setUserCredits] = useState<UserCreditsDocument | null>(
    null,
  );
  const { setIsLoading } = useLoader();

  useEffect(() => {
    const unsubscribe = listenAuthState(async (user) => {
      if (user) {
        setIsLoading(true);

        setUser(user);

        // Set the imagify.user.id cookie if user is authenticated
        Cookies.set("imagify.user.id", user.uid, {
          expires: 30 // 30 days
        });

        try {
          const credits = await getUserCredits(user.uid);
          setUserCredits(credits);
        } catch {
          setUserCredits(null);
        }
      } else {
        setUser(null);
        setUserCredits(null);

        // Clear the imagify.user.id cookie if user is not authenticated
        Cookies.remove("imagify.user.id");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setIsLoading]);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        setUser,
        userCredits,
        setUserCredits,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
