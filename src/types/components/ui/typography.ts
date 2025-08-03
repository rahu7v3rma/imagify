import { ReactNode } from "react";

export interface H1Props {
  children: ReactNode;
}

export interface H2Props {
  children: ReactNode;
}

export interface H3Props {
  children: ReactNode;
}

export interface H4Props {
  children: ReactNode;
}

export interface PProps {
  children: ReactNode;
}

export interface MutedProps {
  children: ReactNode;
}

export interface SmallProps {
  children: ReactNode;
}

export interface LargeProps {
  children: ReactNode;
}

export interface LeadProps {
  children: ReactNode;
}

export interface InlineCodeProps {
  children: ReactNode;
}

export interface ListProps {
  options: string[];
}

export interface TableProps {
  headers: string[];
  rows: string[][];
}

export interface BlockquoteProps {
  children: ReactNode;
}
