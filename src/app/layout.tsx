"use client";

import clsx from "clsx";
import { Suspense } from "react";
import { LoaderProvider } from "../context/loader";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { geist } from "@/configs/app";
import { LayoutProps } from "@/types/app/layout";

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(geist.className, "min-h-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoaderProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
