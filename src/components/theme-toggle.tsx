"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeHook, DARK_THEME_MODE, LIGHT_THEME_MODE } from "@/hooks/theme";
import { Switch } from "./ui/switch";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeHook();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-4 h-4" />
      <Switch
        checked={theme === DARK_THEME_MODE}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? DARK_THEME_MODE : LIGHT_THEME_MODE)
        }
      ></Switch>
      <Moon className="w-4 h-4" />
    </div>
  );
}
