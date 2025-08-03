"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Large, Small } from "@/components/ui/typography";
import { LINKS } from "@/constants/public/navbar";

export default function NavbarComponent() {
  return (
    <nav className="backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="hidden md:flex">
          <Link href={ROUTES.HOME}>
            <Large>imagify.pro</Large>
          </Link>
        </div>
        <div className="hidden md:flex md:space-x-6">
          {LINKS.map(({ label, href }) => (
            <Link key={href} href={href}>
              <Small>{label}</Small>
            </Link>
          ))}
        </div>
        <nav className="flex items-center space-x-2">
          <Button variant="default" asChild>
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
        </nav>
      </div>
    </nav>
  );
}
