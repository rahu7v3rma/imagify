"use client";

import {
  Button as UIButton,
  ButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { cn } from "@/utils/common";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme";

export function Button({ children, disabled, ...props }: UIButtonProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      whileHover={
        disabled
          ? undefined
          : isDark
          ? {
              scale: 1.02,
              filter: "brightness(0.9)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            }
          : {
              scale: 1.02,
              filter: "brightness(1.2)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            }
      }
      transition={disabled ? undefined : { duration: 0.4 }}
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

export function IconButton({ 
  children, 
  onClick, 
  className,
  variant = "ghost",
  ...props 
}: UIButtonProps & {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { isDark } = useTheme();

  return (
    <motion.div
      whileHover={
        props.disabled
          ? undefined
          : isDark
          ? {
              scale: 1.1,
              filter: "brightness(0.9)",
            }
          : {
              scale: 1.1,
              filter: "brightness(1.2)",
            }
      }
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <UIButton
        variant={variant}
        size="icon"
        onClick={onClick}
        className={cn(className)}
        {...props}
      >
        {children}
      </UIButton>
    </motion.div>
  );
}
