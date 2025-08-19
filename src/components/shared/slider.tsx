"use client";

import { Slider as UISlider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { cn } from "@/utils/common";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  label: string;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
}

export const Slider = ({
  value,
  onValueChange,
  label,
  max = 100,
  min = 1,
  step = 1,
  className = "w-full",
}: SliderProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <UISlider
          value={value}
          onValueChange={onValueChange}
          max={max}
          min={min}
          step={step}
          className={cn(
            className,
            "cursor-pointer",
            // Range transitions
            "[&_[data-radix-slider-range]]:transition-all [&_[data-radix-slider-range]]:duration-300 [&_[data-radix-slider-range]]:ease-out",
            // Thumb base transitions - override the default transition-colors with transition-all
            "[&_[data-radix-slider-thumb]]:!transition-all [&_[data-radix-slider-thumb]]:!duration-200 [&_[data-radix-slider-thumb]]:!ease-out",
            // Specifically transition box-shadow for the focus ring
            "[&_[data-radix-slider-thumb]]:transition-[colors,transform,box-shadow,border-color]",
            // Smooth transform when thumb moves
            "[&_[data-radix-slider-thumb]]:will-change-[transform,box-shadow]",
            // Hover state for thumb
            "[&_[data-radix-slider-thumb]:hover]:scale-110 [&_[data-radix-slider-thumb]:hover]:transition-transform"
          )}
        />
      </motion.div>
    </div>
  );
};
