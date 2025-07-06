"use client";

import { Input, InputProps } from "@heroui/react";
import { useState, forwardRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface PasswordInputProps extends Omit<InputProps, "type" | "endContent"> {
  placeholder?: string;
}

interface FileInputProps extends Omit<InputProps, "type" | "endContent"> {
  accept?: string;
  onFileChange?: (file: File | null) => void;
}

interface CustomInputProps extends Omit<InputProps, "endContent"> {
  name?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
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

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, classNames, accept = "*/*", onFileChange, ...props }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileChange?.(file);
      } else {
        onFileChange?.(null);
      }
    };

    return (
      <Input
        ref={ref}
        type="file"
        accept={accept}
        className={clsx(className)}
        classNames={{
          base: clsx("w-full", classNames?.base),
          mainWrapper: clsx("w-full", classNames?.mainWrapper),
          inputWrapper: clsx(
            "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500",
            "dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400",
            "bg-default-50 dark:bg-zinc-800/50",
            "transition-colors duration-200",
            "min-h-[56px]",
            classNames?.inputWrapper
          ),
          innerWrapper: clsx("bg-transparent", classNames?.innerWrapper),
          input: clsx(
            "bg-transparent",
            "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0",
            "file:text-sm file:font-medium file:transition-colors file:cursor-pointer",
            "file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200",
            "dark:file:bg-zinc-700 dark:file:text-zinc-200 dark:hover:file:bg-zinc-600",
            "text-transparent",
            "[&::-webkit-file-upload-button]:mr-4 [&::-webkit-file-upload-button]:py-2 [&::-webkit-file-upload-button]:px-4",
            "[&::-webkit-file-upload-button]:rounded-lg [&::-webkit-file-upload-button]:border-0",
            "[&::-webkit-file-upload-button]:text-sm [&::-webkit-file-upload-button]:font-medium",
            "[&::-webkit-file-upload-button]:transition-colors [&::-webkit-file-upload-button]:cursor-pointer",
            "[&::-webkit-file-upload-button]:bg-primary-100 [&::-webkit-file-upload-button]:text-primary-700",
            "hover:[&::-webkit-file-upload-button]:bg-primary-200",
            "dark:[&::-webkit-file-upload-button]:bg-zinc-700 dark:[&::-webkit-file-upload-button]:text-zinc-200",
            "dark:hover:[&::-webkit-file-upload-button]:bg-zinc-600",
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
          <div className="flex items-center justify-center p-2">
            <DocumentIcon className="w-5 h-5 text-default-500 dark:text-zinc-400" />
          </div>
        }
        onChange={handleFileChange}
        {...props}
      />
    );
  }
);

FileInput.displayName = "FileInput";

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, classNames, actionButton, name, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        name={name}
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
          actionButton ? (
            <div className="flex items-center justify-center self-center">
              <button
                type="button"
                onClick={actionButton.onClick}
                disabled={actionButton.disabled}
                className={clsx(
                  "py-2 px-4 rounded-lg border-0",
                  "text-sm font-medium transition-colors cursor-pointer",
                  "bg-primary-100 text-primary-700 hover:bg-primary-200",
                  "dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-100",
                  "dark:disabled:hover:bg-zinc-700",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                  "dark:focus:ring-primary-400 dark:focus:ring-offset-zinc-800"
                )}
              >
                {actionButton.text}
              </button>
            </div>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
