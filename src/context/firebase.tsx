import {
  listenAuthState,
  getUserCents,
  UserCentsDocument,
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
  userCents: UserCentsDocument | null;
  setUserCents: (cents: UserCentsDocument | null) => void;
}>({
  user: null,
  setUser: () => {},
  userCents: null,
  setUserCents: () => {},
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userCents, setUserCents] = useState<UserCentsDocument | null>(
    null
  );
  const { setIsLoading } = useLoader();

  useEffect(() => {
    const unsubscribe = listenAuthState(async (user) => {
      if (user) {
        setUser(user);
        try {
          const cents = await getUserCents(user.uid);
          setUserCents(cents);
        } catch {
          setUserCents(null);
        }
      } else {
        setUser(null);
        setUserCents(null);
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
        userCents,
        setUserCents,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
