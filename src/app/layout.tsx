"use client";

import clsx from "clsx";
import { Suspense } from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { ReactNode } from "react";
import { TRPCProvider } from "@/lib/trpc/provider";
import PageTransition from "@/components/transitions";
import { UserProvider } from "@/context/user/provider";
import { ThemeProvider } from "@/context/theme";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={clsx(geist.className, "min-h-screen")}>
        <ThemeProvider>
          <TRPCProvider>
            <UserProvider>
              <Suspense fallback={null}>
                <PageTransition>{children}</PageTransition>
              </Suspense>
            </UserProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
