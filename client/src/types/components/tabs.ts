import React from "react";

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export interface TabsTriggerProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}

export interface TabsContentProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}