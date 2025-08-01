"use client";

import {
  Input as HeroInput,
  Textarea as HeroTextarea,
  Button,
  Select as HeroSelect,
  SelectItem,
} from "@heroui/react";
import { useState, ChangeEvent } from "react";
import { PhotoIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const PasswordInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <HeroInput
      value={value}
      onChange={onChange}
      type={isPasswordVisible ? "text" : "password"}
      label={label}
      classNames={{
        inputWrapper:
          "bg-transparent border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200",
        input:
          "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
        base: "w-full",
        mainWrapper: "w-full",
      }}
      endContent={
        <Button
          isIconOnly
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <EyeSlashIcon className="w-4 h-4 text-default-500 dark:text-zinc-400" />
          ) : (
            <EyeIcon className="w-4 h-4 text-default-500 dark:text-zinc-400" />
          )}
        </Button>
      }
    />
  );
};

export const ImageInput = ({
  onChange,
  label,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <HeroInput
      type="file"
      accept="image/*"
      label={label}
      classNames={{
        inputWrapper:
          "bg-transparent border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200 min-h-[56px]",
        input:
          "bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:transition-colors file:cursor-pointer file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 dark:file:bg-zinc-700 dark:file:text-zinc-200 dark:hover:file:bg-zinc-600 text-transparent [&::-webkit-file-upload-button]:mr-4 [&::-webkit-file-upload-button]:py-2 [&::-webkit-file-upload-button]:px-4 [&::-webkit-file-upload-button]:rounded-lg [&::-webkit-file-upload-button]:border-0 [&::-webkit-file-upload-button]:text-sm [&::-webkit-file-upload-button]:font-medium [&::-webkit-file-upload-button]:transition-colors [&::-webkit-file-upload-button]:cursor-pointer [&::-webkit-file-upload-button]:bg-primary-100 [&::-webkit-file-upload-button]:text-primary-700 hover:[&::-webkit-file-upload-button]:bg-primary-200 dark:[&::-webkit-file-upload-button]:bg-zinc-700 dark:[&::-webkit-file-upload-button]:text-zinc-200 dark:hover:[&::-webkit-file-upload-button]:bg-zinc-600",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
      }}
      endContent={
        <div className="flex items-center justify-center p-2">
          <PhotoIcon className="w-5 h-5 text-default-500 dark:text-zinc-400" />
        </div>
      }
      onChange={onChange}
    />
  );
};

export const TextInput = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <HeroInput
      type="text"
      value={value}
      onChange={onChange}
      label={label}
      classNames={{
        inputWrapper:
          "bg-transparent border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200",
        input:
          "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
        base: "w-full",
        mainWrapper: "w-full",
      }}
    />
  );
};

export const EmailInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <HeroInput
      type="email"
      value={value}
      onChange={onChange}
      label="Email Address"
      classNames={{
        inputWrapper:
          "bg-transparent border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200",
        input:
          "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
        base: "w-full",
        mainWrapper: "w-full",
      }}
    />
  );
};

export const ActionInput = ({
  value,
  onChange,
  label,
  actionButton,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  actionButton: {
    text: string;
    onPress: () => void;
    disabled?: boolean;
  };
}) => {
  return (
    <HeroInput
      type="text"
      value={value}
      onChange={onChange}
      label={label}
      classNames={{
        inputWrapper:
          "bg-transparent border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200",
        input:
          "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
        base: "w-full",
        mainWrapper: "w-full",
      }}
      endContent={
        <Button onPress={actionButton.onPress} disabled={actionButton.disabled}>
          {actionButton.text}
        </Button>
      }
    />
  );
};

export const Textarea = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <HeroTextarea
      value={value}
      onChange={onChange}
      label={label}
      classNames={{
        inputWrapper:
          "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200 bg-transparent",
        input:
          "bg-transparent text-default-900 dark:text-white placeholder:text-default-400 dark:placeholder:text-zinc-400",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
        base: "w-full",
        mainWrapper: "w-full",
      }}
    />
  );
};

export const SelectSingle = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) => {
  return (
    <HeroSelect
      label={label}
      selectedKeys={[value]}
      onSelectionChange={(keys) => onChange(String(Array.from(keys)[0]))}
      classNames={{
        trigger:
          "bg-transparent border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 data-[focus=true]:border-primary-500 dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400 bg-default-50 dark:bg-zinc-800/50 transition-colors duration-200",
        value: "text-default-900 dark:text-white",
        label: "text-default-600 dark:text-zinc-300",
        description: "text-default-500 dark:text-zinc-400",
        errorMessage: "text-danger-500 dark:text-danger-400",
      }}
    >
      {options.map((option) => (
        <SelectItem key={option}>{option}</SelectItem>
      ))}
    </HeroSelect>
  );
};


