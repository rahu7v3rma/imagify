"use client";

import { Button } from "@/components/shared/buttons";
import { Link } from "@/components/shared/links";
import { Logo } from "@/components/shared/logo";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Muted, Small } from "@/components/ui/typography";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/context/user/provider";
import { Menu } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";

function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile } = useUser();

  return (
    <nav className="backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2 h-16">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex">
          <Logo />
        </div>
        <div className="hidden md:flex md:space-x-6">
          <Link href={ROUTES.HOME}>
            <Small>Home</Small>
          </Link>
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
          {userProfile ? (
            <Button variant="default" asChild className="hidden md:flex">
              <NextLink href={ROUTES.DASHBOARD.ROOT}>Dashboard</NextLink>
            </Button>
          ) : (
            <Button variant="default" asChild className="hidden md:flex">
              <NextLink href={ROUTES.LOGIN}>Login</NextLink>
            </Button>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-1">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <Logo />
                </div>
                <div className="flex flex-col flex-1 p-6 space-y-6">
                  <Link href={ROUTES.HOME}>
                    <div className="py-2" onClick={() => setIsOpen(false)}>
                      <Small className="text-lg font-medium">Home</Small>
                    </div>
                  </Link>
                  <Link href={ROUTES.BLOG}>
                    <div className="py-2" onClick={() => setIsOpen(false)}>
                      <Small className="text-lg font-medium">Blog</Small>
                    </div>
                  </Link>
                  <Link href={ROUTES.PRICING}>
                    <div className="py-2" onClick={() => setIsOpen(false)}>
                      <Small className="text-lg font-medium">Pricing</Small>
                    </div>
                  </Link>
                  <Link href={ROUTES.CONTACT}>
                    <div className="py-2" onClick={() => setIsOpen(false)}>
                      <Small className="text-lg font-medium">Contact</Small>
                    </div>
                  </Link>
                  <div className="mt-8">
                    {userProfile ? (
                      <Button
                        variant="default"
                        asChild
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <NextLink href={ROUTES.DASHBOARD.ROOT}>
                          Dashboard
                        </NextLink>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        asChild
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <NextLink href={ROUTES.LOGIN}>Login</NextLink>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </nav>
  );
}

function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto w-full">
      <div className="flex justify-end items-center p-4 w-full">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Muted>
            © {new Date().getFullYear()} imagify.pro. All rights reserved.
          </Muted>
        </div>
        <div className="flex space-x-4">
          <Link href={ROUTES.PRIVACY_POLICY}>
            <Small>Privacy Policy</Small>
          </Link>
          <Link href={ROUTES.TERMS_OF_SERVICE}>
            <Small>Terms of Service</Small>
          </Link>
        </div>
        {/* <div>
          <ThemeToggle />
        </div> */}
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
      <div className="pt-16 px-10 py-4 flex-1">{children}</div>
      <FooterComponent />
    </div>
  );
}
