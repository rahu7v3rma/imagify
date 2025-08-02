"use client";

import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ACTION_KEYS } from "@/constants/dashboard/header";

export default function Header() {
  const router = useRouter();

  const logout = async () => {};

  const handleProfileAction = (actionKey: string) => {
    if (actionKey === ACTION_KEYS.SETTINGS) {
      router.push(ROUTES.DASHBOARD_SETTINGS);
    }
    if (actionKey === ACTION_KEYS.LOGOUT) {
      logout();
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <header className="w-full backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div>
          <p
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            imagify.pro
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD_BILLING)}
            className="text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            {0} credits
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8" src="" alt="User" fallback="U" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => handleProfileAction(ACTION_KEYS.SETTINGS)}>
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
