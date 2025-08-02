"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils/common";

export const Avatar = ({
  className,
  src,
  alt,
  fallback,
  ...props
}: {
  className?: string;
  src?: string;
  alt?: string;
  fallback?: string;
}) => (
  <AvatarPrimitive.Root
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    <AvatarPrimitive.Image
      src={src}
      alt={alt}
      className="aspect-square h-full w-full"
    />
    <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
      {fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);
