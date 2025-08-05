"use client";

import { ROUTES } from "@/configs/app";
import { Small } from "@/components/ui/typography";
import { Link } from "@/components/links";
import { Logo } from "@/components/logo";
import NextLink from "next/link";
import { MotionButton } from "@/components/buttons";

export const LINKS = [
  {
    label: "Blog",
    href: ROUTES.BLOG,
  },
  {
    label: "Pricing",
    href: ROUTES.PRICING,
  },
  {
    label: "Contact",
    href: ROUTES.CONTACT,
  },
];

export default function NavbarComponent() {
  return (
    <nav className="backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2 h-16">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <div className="hidden md:flex md:space-x-6">
          {LINKS.map(({ label, href }) => (
            <Link key={href} href={href}>
              <Small>{label}</Small>
            </Link>
          ))}
        </div>
        <nav className="flex items-center space-x-2">
          <MotionButton variant="default" asChild>
            <NextLink href={ROUTES.LOGIN}>Login</NextLink>
          </MotionButton>
        </nav>
      </div>
    </nav>
  );
}
