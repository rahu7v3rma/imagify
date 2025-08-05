"use client";

import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { BUTTON_VARIANTS } from "@/constants/components/button";
import {
  type ButtonProps,
  type ButtonWrapperProps,
} from "@/types/components/button";
import {
  Button as UIButton,
  ButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { cn } from "@/utils/common";

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={cn(
        BUTTON_VARIANTS({
          variant: props.variant,
          size: props.size,
          className: props.className,
        })
      )}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    >
      {props.children}
    </button>
  );
};

export const ButtonWrapper = (props: ButtonWrapperProps) => {
  return (
    <Slot
      className={cn(
        BUTTON_VARIANTS({
          variant: props.variant,
          size: props.size,
          className: props.className,
        })
      )}
    >
      {props.children}
    </Slot>
  );
};

export function MotionButton({ children, ...props }: UIButtonProps) {
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
