import { ReactNode } from "react";

export type BadgeProps = {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: ReactNode;
};