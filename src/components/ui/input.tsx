"use client";

import { Input } from "@heroui/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function PasswordInput({
  placeholder = "Password",
  value,
  onChange,
  onKeyDown,
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Input
      type={isPasswordVisible ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
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
    />
  );
}
