"use client";

import { useState, ChangeEvent } from "react";
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
  ItemText
} from "@radix-ui/react-select";
import { Input } from "@/components/ui-input";
import { Textarea as ShadcnTextarea } from "@/components/textarea";
import { Button } from "@/components/button";
import { cn } from "@/utils/common";
import { LabelProps, SelectTriggerProps, SelectContentProps, SelectItemProps } from "@/types/components";

const Label = ({ className, htmlFor, children }: LabelProps) => (
  <LabelRoot
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    htmlFor={htmlFor}
  >
    {children}
  </LabelRoot>
);

const SelectTrigger = ({ className, children }: SelectTriggerProps) => (
  <Trigger
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
  >
    {children}
    <Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Icon>
  </Trigger>
);

const SelectContent = ({ className, children }: SelectContentProps) => (
  <Portal>
    <Content
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position="popper"
    >
      <Viewport
        className={cn(
          "p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </Viewport>
    </Content>
  </Portal>
);

const SelectItem = ({ className, children, value }: SelectItemProps) => (
  <Item
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    value={value}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Check className="h-4 w-4" />
      </ItemIndicator>
    </span>

    <ItemText>{children}</ItemText>
  </Item>
);

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


