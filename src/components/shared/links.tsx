'use client';

import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '@/context/theme';

export function Link({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const { isDark, isLight } = useTheme();

  return (
    <>
      {isDark && (
        <NextLink href={href}>
          <motion.div
            whileHover={{
              filter: 'brightness(0.5)',
            }}
            transition={{
              duration: 0.2,
            }}
            className="cursor-pointer"
          >
            {children}
          </motion.div>
        </NextLink>
      )}

      {isLight && (
        <NextLink href={href}>
          <motion.div
            whileHover={{
              filter: 'brightness(11.8)',
            }}
            transition={{
              duration: 0.2,
            }}
            className="cursor-pointer"
          >
            {children}
          </motion.div>
        </NextLink>
      )}
    </>
  );
}

export function TabLink({ children }: { children: ReactNode }) {
  const { isDark, isLight } = useTheme();

  return (
    <>
      {isDark && (
        <motion.div
          whileHover={{
            opacity: 0.8,
          }}
          transition={{
            duration: 0.2,
          }}
          className="cursor-pointer"
        >
          {children}
        </motion.div>
      )}

      {isLight && (
        <motion.div
          whileHover={{
            opacity: 0.8,
          }}
          transition={{
            duration: 0.2,
          }}
          className="cursor-pointer"
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
