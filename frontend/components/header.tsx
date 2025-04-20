"use client";
import { Avatar } from "@heroui/react";

import { Link, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

import { Navbar } from "@heroui/react";
import { useUser } from "../context/user";
import { useEffect } from "react";
export default function Header() {
  console.log("header");
  const { user } = useUser();

  useEffect(() => {
    console.log(user, "user");
  }, [user]);

  return (
    <Navbar position="static" className="shadow-sm">
      <NavbarBrand>
        <Link href="/">
          <p className="font-bold text-inherit text-2xl cursor-pointer hover:opacity-50">
            {process.env.NEXT_PUBLIC_WEBSITE_NAME}
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href={user ? "/profile" : "/login"}>
            <Avatar
              showFallback
              src="https://images.unsplash.com/broken"
              className="cursor-pointer hover:opacity-50"
            />
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
