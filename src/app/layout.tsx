"use client";

import clsx from "clsx";
import { Suspense } from "react";
import { LoaderProvider } from "../context/loader";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { geist } from "@/configs/app";
import { LayoutProps } from "@/types/app/layout";
import { TRPCProvider } from "@/context/trpc";
import PageTransition from "@/components/page-transition";

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
          <LoaderProvider>
            <TRPCProvider>
              <Suspense fallback={null}>
                <PageTransition>{children}</PageTransition>
              </Suspense>
            </TRPCProvider>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
