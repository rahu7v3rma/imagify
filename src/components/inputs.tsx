"use client";

import { useState } from "react";
import { Image, Eye, EyeOff, Check, ChevronDown } from "lucide-react";
import { Root as LabelRoot } from "@radix-ui/react-label";
import {
  Root as Select,
  Value as SelectValue,
  Trigger,
  Icon,
  Portal,
  Content,
  Viewport,
  Item,
  ItemIndicator,
  ItemText,
} from "@radix-ui/react-select";
import { Button } from "@/components/buttons";
import { cn } from "@/utils/common";
import {
  PasswordInputProps,
  ImageInputProps,
  TextInputProps,
  EmailInputProps,
  ActionInputProps,
  TextareaProps,
  SelectSingleProps,
} from "@/types/components/inputs";

export const PasswordInput = ({
  label,
  value,
  onChange,
}: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="password"
      >
        {label}
      </LabelRoot>
      <div className="relative">
        <input
          id="password"
          value={value}
          onChange={onChange}
          type={isPasswordVisible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "pr-10",
          )}
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

export const ImageInput = ({ onChange, label }: ImageInputProps) => {
  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="image"
      >
        {label}
      </LabelRoot>
      <div className="relative">
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={onChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:transition-colors file:cursor-pointer file:bg-primary/10 file:text-primary hover:file:bg-primary/20",
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export const TextInput = ({ value, onChange, label }: TextInputProps) => {
  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="text"
      >
        {label}
      </LabelRoot>
      <input
        id="text"
        type="text"
        value={value}
        onChange={onChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        )}
      />
    </div>
  );
};

export const EmailInput = ({ value, onChange }: EmailInputProps) => {
  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="email"
      >
        Email Address
      </LabelRoot>
      <input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        )}
      />
    </div>
  );
};

export const ActionInput = ({
  value,
  onChange,
  label,
  actionButton,
}: ActionInputProps) => {
  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="action"
      >
        {label}
      </LabelRoot>
      <div className="relative">
        <input
          id="action"
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "pr-20",
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

export const Textarea = ({ value, onChange, label }: TextareaProps) => {
  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="textarea"
      >
        {label}
      </LabelRoot>
      <textarea
        id="textarea"
        value={value}
        onChange={onChange}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        )}
      />
    </div>
  );
};

export const SelectSingle = ({
  label,
  value,
  onChange,
  options,
}: SelectSingleProps) => {
  return (
    <div className="w-full space-y-2">
      <LabelRoot
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
        htmlFor="select"
      >
        {label}
      </LabelRoot>
      <Select value={value} onValueChange={onChange}>
        <Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          )}
        >
          <SelectValue placeholder="Select an option" />
          <Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Icon>
        </Trigger>
        <Portal>
          <Content
            className={cn(
              "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            )}
            position="popper"
          >
            <Viewport
              className={cn(
                "p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
              )}
            >
              {options.map((option) => (
                <Item
                  key={option}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  )}
                  value={option}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <ItemIndicator>
                      <Check className="h-4 w-4" />
                    </ItemIndicator>
                  </span>
                  <ItemText>{option}</ItemText>
                </Item>
              ))}
            </Viewport>
          </Content>
        </Portal>
      </Select>
    </div>
  );
};
