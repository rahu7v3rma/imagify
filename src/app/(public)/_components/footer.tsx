"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "@/context/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function FooterComponent() {
  const { mode, setMode } = useTheme();

  const handleToggle = (isSelected: boolean) => {
    setMode(isSelected ? "dark" : "light");
  };

  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-between items-center p-4">
        {/* Left side - Contact and Privacy links */}
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        {/* Center - Copyright */}
        <div className="text-sm text-default-500">
          © {new Date().getFullYear()} imagify.pro. All rights reserved.
        </div>

        {/* Right side - Theme toggle */}
        {/* <div className="flex items-center gap-2">
          <Switch
            isSelected={mode === "dark"}
            onValueChange={handleToggle}
            size="sm"
            color="primary"
            startContent={<SunIcon className="w-4 h-4" />}
            endContent={<MoonIcon className="w-4 h-4" />}
          />
        </div> */}
      </div>
    </footer>
  );
}
