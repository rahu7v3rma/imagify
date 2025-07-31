import { THEME_KEY } from "@/constants/theme";

export const getTheme = (): "light" | "dark" | null => {
  return localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
};

export const setTheme = (mode: "light" | "dark"): void => {
  localStorage.setItem(THEME_KEY, mode);
};