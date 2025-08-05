"use client";

import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
} from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/common";
import { ReactNode, MouseEvent } from "react";

export interface DropdownMenuContentProps {
  className?: string;
  align?: "start" | "center" | "end";
  children: ReactNode;
}

export interface DropdownMenuItemProps {
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

export const DropdownMenu = Root;

export const DropdownMenuTrigger = Trigger;

export const DropdownMenuContent = ({
  className,
  align,
  children,
}: DropdownMenuContentProps) => {
  return (
    <Portal>
      <Content
        align={align}
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
          className
        )}
      >
        {children}
      </Content>
    </Portal>
  );
};

export const DropdownMenuItem = ({
  className,
  onClick,
  children,
}: DropdownMenuItemProps) => {
  return (
    <Item
      onClick={onClick}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
    >
      {children}
    </Item>
  );
};
