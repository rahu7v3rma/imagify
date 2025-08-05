"use client";

import { Avatar } from "@/components/avatar";
import { Button, ButtonWrapper } from "@/components/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

export const ACTION_KEYS = {
  SETTINGS: "settings",
  LOGOUT: "logout",
};

export default function Header() {
  const router = useRouter();

  const logout = async () => {};

  const handleProfileAction = (actionKey: string) => {
    if (actionKey === ACTION_KEYS.SETTINGS) {
      router.push("/dashboard/settings");
    }
    if (actionKey === ACTION_KEYS.LOGOUT) {
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="w-full backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <p
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push("/")}
          >
            imagify.pro
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/billing")}
            className="text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            {0} credits
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonWrapper
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8" src="" alt="User" fallback="U" />
              </ButtonWrapper>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem
                onClick={() => handleProfileAction(ACTION_KEYS.SETTINGS)}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileAction(ACTION_KEYS.LOGOUT)}
                className="text-red-600 focus:text-red-600"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
