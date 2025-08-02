import { ReactNode, MouseEvent, FormEvent } from "react";

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

export type AvatarProps = {
  className?: string;
  src?: string;
  alt?: string;
  fallback?: string;
};

export interface CardProps {
  className?: string;
  children: ReactNode;
}

export interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export interface DialogOverlayProps {
  className?: string;
}

export interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

export interface DialogHeaderProps {
  className?: string;
  children: ReactNode;
}

export interface DialogFooterProps {
  className?: string;
  children: ReactNode;
}

export interface DialogTitleProps {
  className?: string;
  children: ReactNode;
}

export interface DialogDescriptionProps {
  className?: string;
  children: ReactNode;
}

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

export interface LabelProps {
  className?: string;
  htmlFor?: string;
  children: ReactNode;
}

export interface SelectTriggerProps {
  className?: string;
  children: ReactNode;
}

export interface SelectContentProps {
  className?: string;
  children: ReactNode;
}

export interface SelectItemProps {
  className?: string;
  children: ReactNode;
  value: string;
}

export interface SwitchProps {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
