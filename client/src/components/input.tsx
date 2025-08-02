"use client";

import { useState, ChangeEvent } from "react";
import { Image, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui-input";
import { Textarea as ShadcnTextarea } from "@/components/textarea";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";

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
    <div className="w-full space-y-2">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Input
          id="password"
          value={value}
          onChange={onChange}
          type={isPasswordVisible ? "text" : "password"}
          className="pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
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
    <div className="w-full space-y-2">
      <Label htmlFor="image">{label}</Label>
      <div className="relative">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:transition-colors file:cursor-pointer file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
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
      <Label htmlFor="text">{label}</Label>
      <Input
        id="text"
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
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
    <div className="w-full space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
      />
    </div>
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
    <div className="w-full space-y-2">
      <Label htmlFor="action">{label}</Label>
      <div className="relative">
        <Input
          id="action"
          type="text"
          value={value}
          onChange={onChange}
          className="pr-20"
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
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
}) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor="textarea">{label}</Label>
      <ShadcnTextarea
        id="textarea"
        value={value}
        onChange={onChange}
      />
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
      <Label htmlFor="select">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
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


