"use client";

import { Small, Muted } from "@/components/ui/typography";
import { Link } from "@/components/links";
import { Logo } from "@/components/logo";
import NextLink from "next/link";
import { MotionButton } from "@/components/buttons";

export interface PublicLayoutProps {
  children: React.ReactNode;
}

const LINKS = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

function NavbarComponent() {
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
            <NextLink href="/login">Login</NextLink>
          </MotionButton>
        </nav>
      </div>
    </nav>
  );
}

function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 text-sm">
          <Link href="/privacy-policy">
            <Small>Privacy Policy</Small>
          </Link>
          <Link href="/terms-of-service">
            <Small>Terms of Service</Small>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Muted>
            © {new Date().getFullYear()} imagify.pro. All rights reserved.
          </Muted>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarComponent />
      </div>
      <div className="pt-16 pb-20 px-10 py-4 min-h-screen overflow-y-auto">
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <FooterComponent />
      </div>
    </div>
  );
}
