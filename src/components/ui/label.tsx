import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/utils/common";
import type { LabelProps } from "@/types/components/ui/label";

export const Label = ({ className, children, htmlFor }: LabelProps) => (
  <LabelPrimitive.Root
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    htmlFor={htmlFor}
  >
    {children}
  </LabelPrimitive.Root>
);
