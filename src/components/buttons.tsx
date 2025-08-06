"use client";

import {
  Button as UIButton,
  ButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { motion } from "framer-motion";

export function Button({ children, disabled, ...props }: UIButtonProps) {
  return (
    <motion.div
      whileHover={
        disabled
          ? undefined
          : {
              filter: "brightness(0.5)",
            }
      }
      transition={disabled ? undefined : { duration: 0.2 }}
    >
      <UIButton disabled={disabled} {...props}>
        {children}
      </UIButton>
    </motion.div>
  );
}
