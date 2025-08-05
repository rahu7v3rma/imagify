import { Card, CardContent } from "@/components/ui/card";
import { Muted, P } from "@/components/ui/typography";
import { LucideIcon } from "lucide-react";

export interface PricingToolsProps {
  tools: {
    icon: LucideIcon;
    title: string;
    description: string;
    cost: string;
  }[];
}

export default function PricingTools({ tools }: PricingToolsProps) {
  return (
    <div className="flex flex-row gap-4 flex-wrap justify-center w-3/4">
      {tools.map(({ icon: Icon, title, description, cost }) => (
        <Card key={title} className="h-full w-[300px]">
          <CardContent className="p-6 h-full">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <Icon />
              </div>
              <div className="text-center mt-4">
                <P>{title}</P>
                <Muted>{description}</Muted>
              </div>
              <div className="text-center mt-4">
                <P>💳 {cost}</P>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}