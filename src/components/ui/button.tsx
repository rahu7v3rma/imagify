import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/common";
import { buttonVariants } from "@/constants/components/ui/button";
import type { ButtonProps } from "@/types/components/ui/button";

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
};
