import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/common";
import type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from "@/types/components/ui/breadcrumb";

export const Breadcrumb = ({ className, children }: BreadcrumbProps) => (
  <nav aria-label="breadcrumb" className={className}>
    {children}
  </nav>
);

export const BreadcrumbList = ({
  className,
  children,
}: BreadcrumbListProps) => (
  <ol
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
  >
    {children}
  </ol>
);

export const BreadcrumbItem = ({
  className,
  children,
}: BreadcrumbItemProps) => (
  <li className={cn("inline-flex items-center gap-1.5", className)}>
    {children}
  </li>
);

export const BreadcrumbLink = ({
  asChild = false,
  className,
  children,
  href,
}: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      className={cn("transition-colors hover:text-foreground", className)}
      href={href}
    >
      {children}
    </Comp>
  );
};

export const BreadcrumbPage = ({
  className,
  children,
}: BreadcrumbPageProps) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
  >
    {children}
  </span>
);

export const BreadcrumbSeparator = ({
  children,
  className,
}: BreadcrumbSeparatorProps) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
  >
    {children ?? <ChevronRight />}
  </li>
);

export const BreadcrumbEllipsis = ({ className }: BreadcrumbEllipsisProps) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
