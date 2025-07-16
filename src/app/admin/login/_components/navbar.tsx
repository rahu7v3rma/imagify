"use client";

import {
  Button,
  Link as HeroUILink,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/firebase";

export default function NavbarComponent() {
  const router = useRouter();
  const { user } = useFirebase();

  const handleBrandClick = () => {
    router.push("/admin");
  };

  return (
    <Navbar className="backdrop-blur-sm border-b border-divider bg-inherit">
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={handleBrandClick}
        >
          imagify.pro - Admin
        </p>
      </NavbarBrand>

      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <Button as={Link} href="/admin/dashboard" variant="solid" color="primary">
              Dashboard
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button as={Link} href="/admin/login" variant="solid" color="primary">
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
} 