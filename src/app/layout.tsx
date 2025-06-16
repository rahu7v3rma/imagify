"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { Geist } from "next/font/google";
import { FirebaseProvider } from "../context/firebase";
import { LoaderProvider } from "../context/loader";
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
            <FirebaseProvider>{children}</FirebaseProvider>
            <ToastProvider />
          </LoaderProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
