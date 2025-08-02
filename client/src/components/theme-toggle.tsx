"use client";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { THEME_MODES } from "@/constants/theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-4 h-4" />
      <Switch
        checked={theme === THEME_MODES.DARK}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? THEME_MODES.DARK : THEME_MODES.LIGHT)
        }
      />
      <Moon className="w-4 h-4" />
    </div>
  );
}
