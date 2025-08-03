"use client";

import { createContext, useContext, useState } from "react";
import Loader from "@/components/loader";
import { LoaderContextType, LoaderProviderProps } from "@/types/context/loader";

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
