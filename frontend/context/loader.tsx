import { createContext, useContext, useState } from "react";

const LoaderContext = createContext({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
});

export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => {
  return useContext(LoaderContext);
};
