"use client";

import { Input, InputProps } from "@heroui/react";
import { useState, forwardRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface PasswordInputProps extends Omit<InputProps, "type" | "endContent"> {
  placeholder?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ placeholder = "Password", className, classNames, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <Input
        ref={ref}
        type={isPasswordVisible ? "text" : "password"}
        placeholder={placeholder}
        className={clsx(className)}
        classNames={{
          base: clsx("w-full", classNames?.base),
          mainWrapper: clsx("w-full", classNames?.mainWrapper),
          inputWrapper: clsx(
            "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500",
            "dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400",
            "bg-default-50 dark:bg-zinc-800/50",
            "transition-colors duration-200",
            classNames?.inputWrapper
          ),
          innerWrapper: clsx("bg-transparent", classNames?.innerWrapper),
          input: clsx(
            "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
            classNames?.input
          ),
          label: clsx("text-default-600 dark:text-zinc-300", classNames?.label),
          description: clsx(
            "text-default-500 dark:text-zinc-400",
            classNames?.description
          ),
          errorMessage: clsx(
            "text-danger-500 dark:text-danger-400",
            classNames?.errorMessage
          ),
          ...classNames,
        }}
        endContent={
          <button
            className="focus:outline-none p-1 rounded-md hover:bg-default-100 dark:hover:bg-zinc-700 transition-colors"
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="w-4 h-4 text-default-500 dark:text-zinc-400" />
            ) : (
              <EyeIcon className="w-4 h-4 text-default-500 dark:text-zinc-400" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, classNames, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={clsx(className)}
        classNames={{
          base: clsx("w-full", classNames?.base),
          mainWrapper: clsx("w-full", classNames?.mainWrapper),
          inputWrapper: clsx(
            "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500",
            "dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400",
            "bg-default-50 dark:bg-zinc-800/50",
            "transition-colors duration-200",
            classNames?.inputWrapper
          ),
          innerWrapper: clsx("bg-transparent", classNames?.innerWrapper),
          input: clsx(
            "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
            classNames?.input
          ),
          label: clsx("text-default-600 dark:text-zinc-300", classNames?.label),
          description: clsx(
            "text-default-500 dark:text-zinc-400",
            classNames?.description
          ),
          errorMessage: clsx(
            "text-danger-500 dark:text-danger-400",
            classNames?.errorMessage
          ),
          ...classNames,
        }}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
