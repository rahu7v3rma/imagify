import { ReactNode } from "react";

export interface H1Props {
  children: ReactNode;
  className?: string;
}

export interface H2Props {
  children: ReactNode;
  className?: string;
}

export interface H3Props {
  children: ReactNode;
  className?: string;
}

export interface H4Props {
  children: ReactNode;
  className?: string;
}

export interface PProps {
  children: ReactNode;
  className?: string;
}

export interface MutedProps {
  children: ReactNode;
  className?: string;
}

export interface SmallProps {
  children: ReactNode;
  className?: string;
}

export interface LargeProps {
  children: ReactNode;
  className?: string;
}

export interface LeadProps {
  children: ReactNode;
  className?: string;
}

export interface InlineCodeProps {
  children: ReactNode;
  className?: string;
}

export interface ListProps {
  options: ReactNode[];
  className?: string;
}

export interface TableProps {
  headers: string[];
  rows: string[][];
  className?: string;
}

export interface BlockquoteProps {
  children: ReactNode;
  className?: string;
}

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}
