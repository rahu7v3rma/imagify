"use client";
import { Avatar } from "@heroui/react";

import { Link, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

import { Navbar } from "@heroui/react";
import { useUser } from "../context/user";
import { useEffect } from "react";
import { useApi } from "../utils/api";

export default function Header() {
  const { user } = useUser();

  const connectApi = useApi({
    url: "/connect",
    method: "GET",
  });

  useEffect(() => {
    connectApi();
  }, []);

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
              name={user?.name
                ?.split(" ")
                .map((x) => x[0])
                .join("")}
              className="cursor-pointer hover:opacity-50"
            />
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
