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

const FirebaseContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  userCredits: UserCreditsDocument | null;
  setUserCredits: (credits: UserCreditsDocument | null) => void;
}>({
  user: null,
  setUser: () => {},
  userCredits: null,
  setUserCredits: () => {},
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
        setUser(user);
        try {
          const credits = await getUserCredits(user.uid);
          setUserCredits(credits);
        } catch {
          setUserCredits(null);
        }
      } else {
        setUser(null);
        setUserCredits(null);
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
