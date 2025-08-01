"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "@/context/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { THEME_MODES } from "@/constants/theme";

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <Switch
      isSelected={mode === THEME_MODES.DARK}
      onValueChange={(value: boolean) => setMode(value ? THEME_MODES.DARK : THEME_MODES.LIGHT)}
      size="md"
      color="primary"
      startContent={<SunIcon className="w-4 h-4" />}
      endContent={<MoonIcon className="w-4 h-4" />}
    />
  );
}