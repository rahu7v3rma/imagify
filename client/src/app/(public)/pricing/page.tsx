import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TOOLS } from "@/constants/dashboard/pricing";
import { ROUTES } from "@/constants/routes";
import { H1, H2, Muted, P } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";

export default async function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-2 max-w-4xl mx-auto">
        <H1>Simple, pay-as-you-go pricing</H1>
        <P>
          Purchase prepaid processing credits and use them across any tool. No
          subscriptions, surprise bills, or hidden fees—just straight-forward
          pricing that scales with your creativity.
        </P>
      </div>

      <div className="flex flex-row gap-4 flex-wrap justify-center">
        {TOOLS.map(({ icon: Icon, title, description, cost }) => (
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

      <div className="text-center space-y-4 pt-4">
        <div className="flex flex-col items-center justify-center">
          <H2>Ready to get started?</H2>
          <Muted>
            Create a free account and top-up credits whenever you need them.
          </Muted>
        </div>
        <Button variant="default" asChild>
          <Link href={ROUTES.SIGNUP}>Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
