"use client";

import { Root, Image, Fallback } from "@radix-ui/react-avatar";
import { cn } from "@/utils/common";
export type AvatarProps = {
  className?: string;
  src?: string;
  alt?: string;
  fallback?: string;
};

export const Avatar = ({ className, src, alt, fallback }: AvatarProps) => (
  <Root
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
  >
    <Image src={src} alt={alt} className="aspect-square h-full w-full" />
    <Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
      {fallback}
    </Fallback>
  </Root>
);
