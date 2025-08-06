"use client";

import { Small, Muted } from "@/components/ui/typography";
import { Link } from "@/components/links";
import { Logo } from "@/components/logo";
import NextLink from "next/link";
import { Button } from "@/components/buttons";
import { ROUTES } from "@/constants/routes";

function NavbarComponent() {
  return (
    <nav className="backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2 h-16">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <div className="hidden md:flex md:space-x-6">
          <Link href={ROUTES.BLOG}>
            <Small>Blog</Small>
          </Link>
          <Link href={ROUTES.PRICING}>
            <Small>Pricing</Small>
          </Link>
          <Link href={ROUTES.CONTACT}>
            <Small>Contact</Small>
          </Link>
        </div>
        <nav className="flex items-center space-x-2">
          <Button variant="default" asChild>
            <NextLink href={ROUTES.LOGIN}>Login</NextLink>
          </Button>
        </nav>
      </div>
    </nav>
  );
}

function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center items-center p-4 gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm order-1 md:order-1">
          <Link href={ROUTES.PRIVACY_POLICY}>
            <Small>Privacy Policy</Small>
          </Link>
          <Link href={ROUTES.TERMS_OF_SERVICE}>
            <Small>Terms of Service</Small>
          </Link>
        </div>

        <div className="flex items-center gap-2 order-2 md:order-2">
          <Muted>
            © {new Date().getFullYear()} imagify.pro. All rights reserved.
          </Muted>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarComponent />
      </div>
      <div className="pt-16 px-10 py-4 flex-1">
        {children}
      </div>
      <FooterComponent />
    </div>
  );
}
