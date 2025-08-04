import { cn } from "@/utils/common";
import { badgeVariants } from "@/constants/components/ui/badge";
import type { BadgeProps } from "@/types/components/ui/badge";

export const Badge = ({ className, variant, children }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)}>{children}</div>
);
