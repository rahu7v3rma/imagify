import { createContext, ReactNode, useContext, useState } from "react";
import Loader from "@/components/loader";

const LoaderContext = createContext<{
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
