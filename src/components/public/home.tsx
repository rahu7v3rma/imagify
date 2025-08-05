import { Card, CardContent } from "@/components/ui/card";
import { H4, Small } from "@/components/ui/typography";
import { MotionCardWrapper } from "@/components/links";
import NextLink from "next/link";
import { HOME_TOOLS } from "@/utils/features";

export function HomeToolsGrid() {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      {HOME_TOOLS.map(({ icon: Icon, href, title, description }) => (
        <NextLink key={href} href={href}>
          <MotionCardWrapper key={href}>
            <Card key={href} className="h-[220px] w-[250px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2">
                    <H4 className="font-bold text-sm">{title}</H4>
                    <Small className="text-xs text-muted-foreground">
                      {description}
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </NextLink>
      ))}
    </div>
  );
}