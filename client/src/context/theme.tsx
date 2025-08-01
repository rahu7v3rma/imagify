import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { getTheme, setTheme } from "@/utils/local-storage";
import { ThemeMode } from "@/types/theme";
import { THEME_MODES } from "@/constants/theme";

const ThemeContext = createContext<{
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}>({
  mode: THEME_MODES.LIGHT,
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(THEME_MODES.LIGHT);

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
