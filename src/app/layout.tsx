"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { Geist } from "next/font/google";
import NavbarComponent from "./_components/navbar";
import { LoaderProvider } from "../context/loader";
import { FirebaseProvider } from "../context/firebase";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <HeroUIProvider>
          <LoaderProvider>
            <FirebaseProvider>
              <div className="p-2">
                <NavbarComponent />
              </div>
              <div className="p-2 flex flex-col items-center justify-center">
                {children}
              </div>
            </FirebaseProvider>
            <ToastProvider />
          </LoaderProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
