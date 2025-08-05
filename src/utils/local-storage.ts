import { ThemeMode, THEME_KEY } from "@/hooks/theme";

export const getTheme = (): ThemeMode | null => {
  return localStorage.getItem(THEME_KEY) as ThemeMode | null;
};

export const setTheme = (mode: ThemeMode): void => {
  localStorage.setItem(THEME_KEY, mode);
};
