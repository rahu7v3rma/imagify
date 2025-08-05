import { cn } from "@/utils/common";
export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ className, children }: CardProps) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);

export const CardContent = ({ className, children }: CardContentProps) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);
