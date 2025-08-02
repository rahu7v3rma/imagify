"use client";

import clsx from "clsx";
import { ReactNode, Suspense } from "react";
import { LoaderProvider } from "../context/loader";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { geist } from "@/configs/app";

export default function RootLayout({ children }: { children: ReactNode }) {
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
