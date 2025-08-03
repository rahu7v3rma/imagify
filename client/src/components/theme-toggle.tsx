"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { THEME_MODES } from "@/constants/theme";
import {
  Root as SwitchRoot,
  Thumb as SwitchThumb,
} from "@radix-ui/react-switch";
import { cn } from "@/utils/common";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-4 h-4" />
      <SwitchRoot
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        )}
        checked={theme === THEME_MODES.DARK}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? THEME_MODES.DARK : THEME_MODES.LIGHT)
        }
      >
        <SwitchThumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        />
      </SwitchRoot>
      <Moon className="w-4 h-4" />
    </div>
  );
}
