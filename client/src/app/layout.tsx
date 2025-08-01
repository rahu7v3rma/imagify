"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import clsx from "clsx";
import { ReactNode, Suspense } from "react";
import { LoaderProvider } from "../context/loader";
import { ThemeProvider, useTheme } from "../context/theme";
import "./globals.css";
import { geist } from "@/configs/app";

function RootApp({ children }: { children: ReactNode }) {
  const { mode } = useTheme();

  return (
    <html lang="en" className={mode}>
      <body className={clsx(geist.className, "dark:bg-zinc-800 min-h-screen")}>
        <HeroUIProvider>
          <LoaderProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <ToastProvider />
          </LoaderProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <RootApp>{children}</RootApp>
    </ThemeProvider>
  );
}
