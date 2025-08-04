import { LucideIcon } from "lucide-react";

export interface PricingToolsProps {
  tools: {
    icon: LucideIcon;
    title: string;
    description: string;
    cost: string;
  }[];
}