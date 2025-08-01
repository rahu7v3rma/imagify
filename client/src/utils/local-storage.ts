import { THEME_KEY } from "@/constants/theme";
import { ThemeMode } from "@/types/theme";

export const getTheme = (): ThemeMode | null => {
  return localStorage.getItem(THEME_KEY) as ThemeMode | null;
};

export const setTheme = (mode: ThemeMode): void => {
  localStorage.setItem(THEME_KEY, mode);
};
