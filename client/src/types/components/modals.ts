import { ReactNode } from "react";

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

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}