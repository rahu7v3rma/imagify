import { ReactNode, MouseEvent, FormEvent, ChangeEvent } from "react";

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

export interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface ImageInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export interface TextInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface ActionInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  actionButton: {
    text: string;
    onPress: () => void;
    disabled?: boolean;
  };
}

export interface TextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
}

export interface SelectSingleProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export interface TabsTriggerProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}

export interface TabsContentProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}
