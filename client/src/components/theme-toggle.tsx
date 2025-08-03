"use client";

import { Moon, Sun } from "lucide-react";
import { DARK_THEME_MODE, LIGHT_THEME_MODE } from "@/constants/theme";
import {
  Root as SwitchRoot,
  Thumb as SwitchThumb,
} from "@radix-ui/react-switch";
import { cn } from "@/utils/common";
import { useThemeHook } from "@/hooks/theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeHook();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-4 h-4" />
      <SwitchRoot
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        )}
        checked={theme === DARK_THEME_MODE}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? DARK_THEME_MODE : LIGHT_THEME_MODE)
        }
      >
        <SwitchThumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchRoot>
      <Moon className="w-4 h-4" />
    </div>
  );
}
