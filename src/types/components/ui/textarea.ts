import { ChangeEvent } from "react";

export type TextareaProps = {
  className?: string;
  id?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};
