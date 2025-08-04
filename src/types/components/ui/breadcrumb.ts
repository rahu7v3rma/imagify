import { ReactNode } from "react";

export type BreadcrumbProps = {
  className?: string;
  children: ReactNode;
};

export type BreadcrumbListProps = {
  className?: string;
  children: ReactNode;
};

export type BreadcrumbItemProps = {
  className?: string;
  children: ReactNode;
};

export type BreadcrumbLinkProps = {
  className?: string;
  children: ReactNode;
  asChild?: boolean;
  href?: string;
};

export type BreadcrumbPageProps = {
  className?: string;
  children: ReactNode;
};

export type BreadcrumbSeparatorProps = {
  className?: string;
  children?: ReactNode;
};

export type BreadcrumbEllipsisProps = {
  className?: string;
};