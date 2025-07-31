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

export default function Header() {
  const router = useRouter();

  const logout = async () => {};

  const handleProfileAction = (actionKey: string | number) => {
    if (actionKey === "settings") {
      router.push("/dashboard/settings");
    }
    if (actionKey === "logout") {
      logout();
      router.push("/login");
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
          onClick={() => router.push("/")}
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
            onPress={() => router.push("/dashboard/billing")}
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
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
