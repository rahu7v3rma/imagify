"use client";

import * as React from "react";
import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";

import { cn } from "@/utils/common";
import {
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "@/types/components/tabs";

export const Tabs = Root;

export const TabsList = ({ className, children }: TabsListProps) => (
  <List
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
  >
    {children}
  </List>
);

export const TabsTrigger = ({
  className,
  children,
  value,
}: TabsTriggerProps) => (
  <Trigger
    value={value}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
  >
    {children}
  </Trigger>
);

export const TabsContent = ({
  className,
  children,
  value,
}: TabsContentProps) => (
  <Content
    value={value}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
  >
    {children}
  </Content>
);
