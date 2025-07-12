"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredServices: string[];
  setFilteredServices: (services: string[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<string[]>([]);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filteredServices,
        setFilteredServices,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};