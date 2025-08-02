import { Slot } from "@radix-ui/react-slot";
import { BUTTON_VARIANTS } from "@/constants/components/button";
import { type ButtonProps, type ButtonWrapperProps } from "@/types/components";
import { cn } from "@/utils/common";

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={cn(
        BUTTON_VARIANTS({
          variant: props.variant,
          size: props.size,
          className: props.className,
        })
      )}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    >
      {props.children}
    </button>
  );
};

export const ButtonWrapper = (props: ButtonWrapperProps) => {
  return (
    <Slot
      className={cn(
        BUTTON_VARIANTS({
          variant: props.variant,
          size: props.size,
          className: props.className,
        })
      )}
    >
      {props.children}
    </Slot>
  );
};
