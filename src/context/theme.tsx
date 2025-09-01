import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import {
  getTheme as getLocalStorageTheme,
  setTheme as setLocalStorageTheme,
} from '@/utils/local-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isLight: boolean;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, setTheme } = useNextTheme();
  const mode = (theme === 'dark' ? 'dark' : 'light') as ThemeMode;

  useEffect(() => {
    const storedTheme = getLocalStorageTheme();
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
    }
  }, []);

  const setMode = (mode: ThemeMode) => {
    setTheme(mode);
    setLocalStorageTheme(mode);
  };

  const isLight = mode === 'light';
  const isDark = mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, setMode, isLight, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
