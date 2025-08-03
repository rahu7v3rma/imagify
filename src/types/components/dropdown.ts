import { ReactNode, MouseEvent } from "react";

export interface DropdownMenuContentProps {
  className?: string;
  align?: "start" | "center" | "end";
  children: ReactNode;
}

export interface DropdownMenuItemProps {
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}
