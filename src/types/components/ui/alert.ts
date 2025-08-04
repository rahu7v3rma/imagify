import { ReactNode } from "react";

export type AlertProps = {
  className?: string;
  variant?: "default" | "destructive";
  children: ReactNode;
};

export type AlertTitleProps = {
  className?: string;
  children: ReactNode;
};

export type AlertDescriptionProps = {
  className?: string;
  children: ReactNode;
};
