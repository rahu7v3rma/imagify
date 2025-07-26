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
import { useFirebase } from "@/context/firebase";
// import { logoutUser } from "@/lib/firebase";
import { addToast } from "@heroui/react";
import { useLoader } from "@/context/loader";
import { BoltIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

export default function Header() {
  const router = useRouter();
  const { user, setUser } = useFirebase();
  const { setIsLoading } = useLoader();

  const logout = async () => {
    try {
      setIsLoading(true);
      // await logoutUser();
      setUser(null);

      // Clear the imagify.user.id cookie
      Cookies.remove("imagify.user.id");

      addToast({
        title: "Logged out successfully!",
        color: "success",
      });
      return true;
    } catch {
      addToast({
        title: "Failed to logout",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandClick = () => {
    router.push("/");
  };

  const handleCreditsClick = () => {
    router.push("/dashboard/billing");
  };

  return (
    <Navbar
      maxWidth="full"
      className="w-full backdrop-blur-sm border-b border-divider bg-inherit"
    >
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={handleBrandClick}
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
            onClick={handleCreditsClick}
            className="text-sm font-medium"
          >
            {0} credits
          </Button>
        </NavbarItem>
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
