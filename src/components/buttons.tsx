"use client";

import {
  Button as UIButton,
  ButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { motion } from "framer-motion";

export function Button({ children, ...props }: UIButtonProps) {
  return (
    <motion.div
      whileHover={{
        filter: "brightness(0.5)",
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <UIButton {...props}>{children}</UIButton>
    </motion.div>
  );
}
