"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { Geist } from "next/font/google";
import clsx from "clsx";
import { FirebaseProvider } from "../context/firebase";
import { LoaderProvider } from "../context/loader";
import { ThemeProvider, useTheme } from "../context/theme";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

function RootApp({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  return (
    <html lang="en" className={mode === "dark" ? "dark" : ""}>
      <head>
        <meta
          name="robots"
          content="noindex, nofollow, noarchive, nosnippet, noimageindex"
        />
        <meta
          name="googlebot"
          content="noindex, nofollow, noarchive, nosnippet, noimageindex"
        />
      </head>
      <body className={clsx(geist.className, "dark:bg-zinc-800 min-h-screen")}>
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <RootApp>{children}</RootApp>
    </ThemeProvider>
  );
}
