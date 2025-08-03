"use client";

import { ButtonWrapper } from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function NavbarComponent() {
  const router = useRouter();

  return (
    <nav className="backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <p
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            imagify.pro
          </p>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex md:space-x-6">
              <Link
                href={ROUTES.BLOG}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Blog
              </Link>
              <Link
                href={ROUTES.PRICING}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Login
            </Link>
            <ButtonWrapper>
              <Link href={ROUTES.SIGNUP}>Sign Up</Link>
            </ButtonWrapper>
          </nav>
        </div>
      </div>
    </nav>
  );
}
