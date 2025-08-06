"use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Link({ href, children }: {
  href: string;
  children: ReactNode;
}) {
  return (
    <NextLink href={href}>
      <motion.div
        whileHover={{
          filter: "brightness(0.5)",
        }}
        transition={{
          duration: 0.2,
        }}
        className="cursor-pointer"
      >
        {children}
      </motion.div>
    </NextLink>
  );
}
