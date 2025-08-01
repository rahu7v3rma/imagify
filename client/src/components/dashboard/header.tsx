"use client";

import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { BoltIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "@/constants/routes";
import { ACTION_KEYS } from "@/constants/dashboard/header";

export default function Header() {
  const router = useRouter();

  const logout = async () => {};

  const handleProfileAction = (actionKey: string | number) => {
    if (actionKey === ACTION_KEYS.SETTINGS) {
      router.push(ROUTES.DASHBOARD_SETTINGS);
    }
    if (actionKey === ACTION_KEYS.LOGOUT) {
      logout();
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <Navbar
      maxWidth="full"
      className="w-full backdrop-blur-sm border-b border-divider bg-inherit"
    >
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={() => router.push(ROUTES.HOME)}
        >
          imagify.pro
        </p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            variant="flat"
            size="sm"
            startContent={<BoltIcon className="w-4 h-4" />}
            onPress={() => router.push(ROUTES.DASHBOARD_BILLING)}
            className="text-sm font-medium"
          >
            {0} credits
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar isBordered as="button" className="transition-transform" />
            </DropdownTrigger>
            <DropdownMenu variant="flat" onAction={handleProfileAction}>
              <DropdownItem key={ACTION_KEYS.SETTINGS}>Settings</DropdownItem>
              <DropdownItem key={ACTION_KEYS.LOGOUT} color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
