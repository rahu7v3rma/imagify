"use client";

import clsx from "clsx";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Geist } from "next/font/google";
import { ReactNode } from "react";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

import { TRPCProvider } from "@/lib/trpc/provider";
import PageTransition from "@/components/page-transition";

export interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(geist.className, "min-h-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            <Suspense fallback={null}>
              <PageTransition>{children}</PageTransition>
            </Suspense>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
