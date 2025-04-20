"use client";
import {
  HeroUIProvider,
  ToastProvider
} from "@heroui/react";
import Link from "next/link";
import Header from "../components/header";
import Loader from "../components/loader";
import LoaderProvider from "../context/loader";
import UserProvider from "../context/user";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</title>
        <meta
          name="description"
          content={process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION}
        />
      </head>
      <body>
        <HeroUIProvider>
          <LoaderProvider>
            <UserProvider>
              <div className="relative min-h-screen">
                <Header />
                <div className="flex flex-col items-center py-10">
                  {children}
                </div>
                <div className="h-[40px] flex items-center justify-between px-10 border-t border-gray-200 absolute bottom-0 w-full">
                  <span className="text-gray-600 text-sm">
                    © {new Date().getFullYear()}{" "}
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME}
                  </span>
                  <div className="flex items-center gap-4">
                    <Link href="/contact-us">
                      <span className="cursor-pointer hover:opacity-50 text-gray-600 font-semibold text-sm">
                        Contact us
                      </span>
                    </Link>
                    <Link href="/contact-us">
                      <span className="cursor-pointer hover:opacity-50 text-gray-600 font-semibold text-sm">
                        Privacy Policy
                      </span>
                    </Link>
                  </div>
                </div>
                <Loader />
                <ToastProvider />
              </div>
            </UserProvider>
          </LoaderProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
