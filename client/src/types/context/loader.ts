import { ReactNode } from "react";

export interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface LoaderProviderProps {
  children: ReactNode;
}