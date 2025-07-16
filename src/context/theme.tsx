import { createContext, ReactNode, useContext, useState, useEffect } from "react";

const ThemeContext = createContext<{
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  mode: "light",
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme.mode") as "light" | "dark" | null;
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);

  // Save theme to localStorage whenever mode changes
  useEffect(() => {
    localStorage.setItem("theme.mode", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
