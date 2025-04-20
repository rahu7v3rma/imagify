import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../utils/api";
import { removeAuthToken } from "../utils/localStorage";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchProfile: () => void;
}>({
  user: null,
  setUser: () => {},
  logout: () => {},
  fetchProfile: () => {},
});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const getProfileApi = useApi({
    url: "/user/profile",
    method: "GET",
    showToast: false,
  });

  const fetchProfile = async () => {
    const res = await getProfileApi();
    if (res?.data?.message == "Email not verified") {
      router.push("/verify-email");
      return;
    }
    if (res?.data?.user) {
      setUser(res.data.user);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const router = useRouter();

  const logout = () => {
    setUser(null);
    removeAuthToken();
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
