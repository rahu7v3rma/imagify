"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  getAccessToken as cookiesGetAccessToken,
  deleteAccessToken as cookiesDeleteAccessToken,
  saveAccessToken as cookiesSaveAccessToken,
} from "@/utils/cookies";
import { setAuthorizationHeader } from "@/lib/trpc/provider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type UserProfile = {
  email?: string;
  credits?: number;
  subscriptionPlanName?: string | null;
  subscriptionCreditResetDate?: string | null;
  subscriptionCredits?: number;
  subscriptionActive?: boolean;
};

type UserContextType = {
  userProfile?: UserProfile;
  isLoading: boolean;
  fetchUserProfile: () => void;
  logout: () => void;
  login: (accessToken: string) => void;
};

const UserContext = createContext<UserContextType>({
  userProfile: undefined,
  isLoading: true,
  fetchUserProfile: () => {},
  logout: () => {},
  login: (accessToken: string) => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    user: {
      getProfile: { reset: resetGetProfile },
    },
  } = trpc.useUtils();
  const {
    data: userProfile,
    isLoading: userProfileLoading,
    refetch: fetchUserProfile,
  } = trpc.user.getProfile.useQuery(undefined, {
    enabled: false,
  });

  // on initial load
  useEffect(() => {
    const token = cookiesGetAccessToken();
    if (token) {
      setAuthorizationHeader(token);
      fetchUserProfile();
    }
  }, []);

  const logout = () => {
    setAuthorizationHeader(null);
    cookiesDeleteAccessToken();
    resetGetProfile();
    router.push(ROUTES.LOGIN);
  };

  const login = (accessToken: string) => {
    cookiesSaveAccessToken({ accessToken });
    setAuthorizationHeader(accessToken);
    fetchUserProfile();
    router.push(ROUTES.DASHBOARD.ROOT);
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isLoading: userProfileLoading,
        fetchUserProfile,
        logout,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
