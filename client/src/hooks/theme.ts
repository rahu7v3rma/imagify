"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeMode, isThemeMode, UseThemeHookReturn } from "@/types/theme";
import { DARK_THEME_MODE } from "@/constants/theme";
import {
  getTheme as getLocalStorageTheme,
  setTheme as setLocalStorageTheme,
} from "@/utils/local-storage";

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
