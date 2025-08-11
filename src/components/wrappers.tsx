"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

export const FadeWrapper = ({
  children,
  duration = 0.2,
  y = -10,
}: {
  children: ReactNode;
  duration?: number;
  y?: number;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y }}
        transition={{ duration }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
