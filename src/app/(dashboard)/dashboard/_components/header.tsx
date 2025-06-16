"use client";

import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/firebase";

export default function Header() {
  const router = useRouter();
  const { user } = useFirebase();

  const handleBrandClick = () => {
    router.push("/dashboard");
  };

  return (
    <Navbar className="w-screen">
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={handleBrandClick}
        >
          Socialify
        </p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Avatar
            src={user?.photoURL ?? undefined}
            name={user?.email ?? "Guest"}
            showFallback
            isBordered
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
