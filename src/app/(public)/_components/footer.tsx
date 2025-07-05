"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "@/context/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function FooterComponent() {
  const { mode, setMode } = useTheme();

  const handleToggle = (isSelected: boolean) => {
    setMode(isSelected ? "dark" : "light");
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 backdrop-blur-sm border-t border-divider">
      <div className="flex justify-end items-center p-4">
        <div className="flex items-center gap-2">
          <Switch
            isSelected={mode === "dark"}
            onValueChange={handleToggle}
            size="sm"
            color="primary"
            startContent={<SunIcon className="w-4 h-4" />}
            endContent={<MoonIcon className="w-4 h-4" />}
          />
        </div>
      </div>
    </footer>
  );
}
