import { ReactNode, ChangeEvent } from "react";

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
  error?: string;
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
  error?: string;
}

export interface SelectSingleProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}
