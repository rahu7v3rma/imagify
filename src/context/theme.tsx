import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { getTheme, setTheme } from "@/lib/localStorage";

const ThemeContext = createContext<{
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  mode: "light",
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = getTheme();
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    setTheme(mode);
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
