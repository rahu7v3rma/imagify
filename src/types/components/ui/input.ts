import { ChangeEvent } from "react";

export type InputProps = {
  className?: string;
  type?: string;
  id?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};
