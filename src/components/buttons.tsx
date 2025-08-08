"use client";

import {
  Button as UIButton,
  ButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { cn } from "@/utils/common";
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

export function IconButtonWrapper({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        filter: "brightness(0.5)",
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}
