"use client";

import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/firebase";

export default function NavbarComponent() {
  const router = useRouter();
  const { user } = useFirebase();

  const handleBrandClick = () => {
    router.push("/");
  };

  return (
    <Navbar className="backdrop-blur-sm border-b border-divider bg-inherit">
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={handleBrandClick}
        >
          imagify.pro
        </p>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>
      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <Button as={Link} color="primary" href="/dashboard" variant="solid">
              Dashboard
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="lg:flex">
              <Link href="/login" className="dark:text-white">
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} href="/signup" variant="solid" color="primary">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
