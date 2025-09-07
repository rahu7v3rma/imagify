'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import {
  getAccessToken as cookiesGetAccessToken,
  deleteAccessToken as cookiesDeleteAccessToken,
  saveAccessToken as cookiesSaveAccessToken,
} from '@/utils/cookies';
import { setAuthorizationHeader } from '@/lib/trpc/provider';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { USER_SUBSCRIPTION_PLANS } from '@/constants/credits';

type UserProfile = {
  email?: string;
  credits?: number;
  subscriptionPlanName?: string | null;
  subscriptionCreditResetDate?: string | null;
  subscriptionCredits?: number;
  subscriptionActive?: boolean;
};

type UserFile = {
  base64String: string;
  fileId: number;
};

type UserContextType = {
  userProfile?: UserProfile;
  isLoading: boolean;
  isStandardPlan: boolean;
  isSubscriptionActive: boolean;
  userFiles?: UserFile[];
  fetchUserProfile: () => void;
  fetchUserFiles: () => void;
  logout: () => void;
  login: (accessToken: string) => void;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType>({
  userProfile: undefined,
  isLoading: true,
  isStandardPlan: false,
  isSubscriptionActive: false,
  fetchUserProfile: () => {},
  fetchUserFiles: () => {},
  logout: () => {},
  login: () => {},
  refreshUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    user: {
      getProfile: { reset: resetGetProfile },
      getUserFiles: { reset: resetGetUserFiles },
    },
  } = trpc.useUtils();
  const {
    data: userProfile,
    isLoading: userProfileLoading,
    refetch: fetchUserProfile,
  } = trpc.user.getProfile.useQuery(undefined, {
    enabled: false,
  });
  const {
    data: userFiles,
    isLoading: userFilesLoading,
    refetch: fetchUserFiles,
  } = trpc.user.getUserFiles.useQuery(undefined, {
    enabled: false,
  });

  // on initial load
  useEffect(() => {
    const token = cookiesGetAccessToken();
    if (token) {
      setAuthorizationHeader(token);
      fetchUserProfile();
      fetchUserFiles();
    }
  }, [fetchUserProfile, fetchUserFiles]);

  const logout = () => {
    setAuthorizationHeader(null);
    cookiesDeleteAccessToken();
    resetGetProfile();
    resetGetUserFiles();
    router.push(ROUTES.LOGIN);
  };

  const login = (accessToken: string) => {
    cookiesSaveAccessToken({ accessToken });
    setAuthorizationHeader(accessToken);
    fetchUserProfile();
    fetchUserFiles();
    router.push(ROUTES.DASHBOARD.ROOT);
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        userFiles,
        isLoading: userProfileLoading || userFilesLoading,
        fetchUserProfile,
        fetchUserFiles,
        logout,
        login,
        refreshUser: () => {
          fetchUserProfile();
          fetchUserFiles();
        },
        isStandardPlan:
          userProfile?.subscriptionPlanName ===
          USER_SUBSCRIPTION_PLANS.Standard,
        isSubscriptionActive: userProfile?.subscriptionActive ?? false,
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
