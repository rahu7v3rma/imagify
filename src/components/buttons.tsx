"use client";

import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { ReactNode, MouseEvent, FormEvent } from "react";
import { cva } from "class-variance-authority";
import {
  Button as UIButton,
  ButtonProps as UIButtonProps,
} from "@/components/ui/button";
import { cn } from "@/utils/common";

export const BUTTON_VARIANTS = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (event: FormEvent<HTMLButtonElement>) => void;
}

export interface ButtonWrapperProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={cn(
        BUTTON_VARIANTS({
          variant: props.variant,
          size: props.size,
          className: props.className,
        }),
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
        }),
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
