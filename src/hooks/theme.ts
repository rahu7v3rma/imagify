"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  getTheme as getLocalStorageTheme,
  setTheme as setLocalStorageTheme,
} from "@/utils/local-storage";

export type ThemeMode = "light" | "dark";

export const THEME_KEY = "theme.mode";
export const DARK_THEME_MODE: ThemeMode = "dark";
export const LIGHT_THEME_MODE: ThemeMode = "light";

export const isThemeMode = (value: unknown): value is ThemeMode => {
  return (
    typeof value === "string" &&
    (value === LIGHT_THEME_MODE || value === DARK_THEME_MODE)
  );
};

export interface UseThemeHookReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeHook = (): UseThemeHookReturn => {
  const { setTheme: setNextTheme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(DARK_THEME_MODE);

  const handleSetTheme = (newTheme: ThemeMode) => {
    setCurrentTheme(newTheme);
    setNextTheme(newTheme);
    setLocalStorageTheme(newTheme);
  };

  // sync local storage theme with hook theme state on mount
  useEffect(() => {
    const savedTheme = getLocalStorageTheme();
    if (savedTheme && isThemeMode(savedTheme)) {
      handleSetTheme(savedTheme);
    }
  }, []);

  return {
    theme: currentTheme,
    setTheme: handleSetTheme,
  };
};
