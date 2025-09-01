'use client';

import clsx from 'clsx';
import { Suspense } from 'react';
import '@/styles/globals.css';
import { Geist } from 'next/font/google';
import { ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc/provider';
import PageTransition from '@/components/shared/transitions';
import { UserProvider } from '@/context/user/provider';
import { ThemeProvider } from '@/context/theme';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={clsx(geist.className, 'min-h-screen')}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <TRPCProvider>
              <UserProvider>
                <Suspense fallback={null}>
                  <PageTransition>{children}</PageTransition>
                </Suspense>
              </UserProvider>
            </TRPCProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
