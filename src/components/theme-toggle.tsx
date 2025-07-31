"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "@/context/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <Switch
      isSelected={mode === "dark"}
      onValueChange={(value) => setMode(value ? "dark" : "light")}
      size="md"
      color="primary"
      startContent={<SunIcon className="w-4 h-4" />}
      endContent={<MoonIcon className="w-4 h-4" />}
    />
  );
}