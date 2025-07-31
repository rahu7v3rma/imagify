"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const router = useRouter();

  return (
    <Navbar className="backdrop-blur-sm border-b border-divider bg-inherit">
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={() => router.push("/")}
        >
          imagify.pro
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/blog" className="dark:text-white">
            Blog
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/pricing" className="dark:text-white">
            Pricing
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact" className="dark:text-white">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
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
      </NavbarContent>
    </Navbar>
  );
}
