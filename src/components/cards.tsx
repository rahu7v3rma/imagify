"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface MotionWrapperProps {
  children: ReactNode;
}

export function MotionCardWrapper({ children }: MotionWrapperProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        filter: "brightness(1.2)",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
}