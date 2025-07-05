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
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/firebase";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useFirebase();

  const handleBrandClick = () => {
    router.push("/dashboard");
  };

  return (
    <Navbar maxWidth="full" className="w-full shadow-md">
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={handleBrandClick}
        >
          Imagify
        </p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src={user?.photoURL ?? undefined}
                name={user?.email ?? "Guest"}
                showFallback
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              onAction={(actionKey) => {
                if (actionKey === "settings") {
                  router.push("/dashboard/settings");
                }
                if (actionKey === "logout") {
                  logout();
                  router.push("/login");
                }
              }}
            >
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
