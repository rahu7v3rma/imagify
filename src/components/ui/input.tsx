"use client";

import { Input, InputProps } from "@heroui/react";
import { useState, forwardRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps extends Omit<InputProps, "type" | "endContent"> {
  placeholder?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ placeholder = "Password", ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <Input
        ref={ref}
        type={isPasswordVisible ? "text" : "password"}
        placeholder={placeholder}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="w-4 h-4 text-default-400 pointer-events-none" />
            ) : (
              <EyeIcon className="w-4 h-4 text-default-400 pointer-events-none" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
