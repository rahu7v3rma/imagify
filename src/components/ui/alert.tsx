import { cn } from "@/utils/common";
import { alertVariants } from "@/constants/components/ui/alert";
import type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from "@/types/components/ui/alert";

export const Alert = ({ className, variant, children }: AlertProps) => (
  <div role="alert" className={cn(alertVariants({ variant }), className)}>
    {children}
  </div>
);

export const AlertTitle = ({ className, children }: AlertTitleProps) => (
  <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)}>
    {children}
  </h5>
);

export const AlertDescription = ({
  className,
  children,
}: AlertDescriptionProps) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)}>
    {children}
  </div>
);
