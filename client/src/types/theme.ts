import { DARK_THEME_MODE, LIGHT_THEME_MODE } from "@/constants/theme";

export type ThemeMode = "light" | "dark";

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
