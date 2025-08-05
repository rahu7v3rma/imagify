"use client";

import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import Loader from "@/components/loader";

export interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface LoaderProviderProps {
  children: ReactNode;
}

const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
      <Loader />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
