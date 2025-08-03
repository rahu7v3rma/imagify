"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/buttons";

export default function NavbarComponent() {
  const router = useRouter();

  return (
    <nav className="backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="hidden md:flex">
          <p
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            imagify.pro
          </p>
        </div>
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
        <nav className="flex items-center space-x-2">
          <Button variant="default" onClick={() => router.push(ROUTES.LOGIN)}>
            Login
          </Button>
        </nav>
      </div>
    </nav>
  );
}
