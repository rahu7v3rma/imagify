import { cn } from "@/utils/common";
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "@/types/components/ui/card";

export const Card = ({ className, children }: CardProps) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children }: CardHeaderProps) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

export const CardTitle = ({ className, children }: CardTitleProps) => (
  <div
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
  >
    {children}
  </div>
);

export const CardDescription = ({
  className,
  children,
}: CardDescriptionProps) => (
  <div className={cn("text-sm text-muted-foreground", className)}>
    {children}
  </div>
);

export const CardContent = ({ className, children }: CardContentProps) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);

export const CardFooter = ({ className, children }: CardFooterProps) => (
  <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>
);
