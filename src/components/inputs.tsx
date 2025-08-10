"use client";

import { Button, IconButtonWrapper } from "@/components/buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea as UITextarea } from "@/components/ui/textarea";
import { Muted } from "@/components/ui/typography";
import { cn } from "@/utils/common";
import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const PasswordInput = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Input
          id="password"
          value={value}
          onChange={onChange}
          type={isPasswordVisible ? "text" : "password"}
          className="pr-10 transition-all duration-300 ease-in-out"
        />
        <IconButtonWrapper
          className="absolute top-0 right-0 h-full px-3 z-10 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsPasswordVisible(!isPasswordVisible);
          }}
        >
          {isPasswordVisible ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </IconButtonWrapper>
      </div>
      {error && <Muted className="text-red-500">{error}</Muted>}
    </div>
  );
};

export const ImageInput = ({
  onChange,
  label,
  value,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value?: File;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="image">{label}</Label>
      <Input
        ref={inputRef}
        id="image"
        type="file"
        onChange={onChange}
        accept="image/*"
      />
    </div>
  );
};

export const FileInput = ({
  onChange,
  label,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor="file">{label}</Label>
      <Input id="file" type="file" onChange={onChange} />
    </div>
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
    <div className="w-full space-y-2">
      <Label
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
        htmlFor="text"
      >
        {label}
      </Label>
      <Input
        id="text"
        type="text"
        value={value}
        onChange={onChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        )}
      />
    </div>
  );
};

export const EmailInput = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        className="transition-all duration-300 ease-in-out"
      />
      {error && <Muted className="text-red-500">{error}</Muted>}
    </div>
  );
};

export const TextActionInput = ({
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
    <div className="w-full space-y-2">
      <Label
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
        htmlFor="action"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id="action"
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "pr-20"
          )}
        />
        <Button
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
          onClick={actionButton.onPress}
          disabled={actionButton.disabled}
        >
          {actionButton.text}
        </Button>
      </div>
    </div>
  );
};

export const Textarea = ({
  value,
  onChange,
  label,
  error,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  error?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="message">{label}</Label>
      <UITextarea id="message" value={value} onChange={onChange} />
      {error && <Muted className="text-red-500">{error}</Muted>}
    </div>
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
    <div className="w-full space-y-2">
      <Label
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
        htmlFor="select"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
