import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TOOLS } from "@/constants/dashboard/pricing";
import { H1, H2, Muted, P } from "@/components/ui/typography";
import Breadcrumbs from "@/components/breadcrumbs";
import { BREADCRUMB_ITEMS } from "@/constants/public/pricing";
import { ROUTES } from "@/constants/routes";
import PricingTools from "@/components/public/pricing";

export default async function PricingPage() {
  return (
    <div className="h-full w-full">
      <div className="w-full">
        <Breadcrumbs className="mb-8" items={BREADCRUMB_ITEMS} />
      </div>
      <div className="space-y-12 flex flex-col items-center justify-center">
        <div className="text-center space-y-2 max-w-4xl mx-auto">
          <H1>Simple, pay-as-you-go pricing</H1>
          <P>
            Purchase prepaid processing credits and use them across any tool. No
            subscriptions, surprise bills, or hidden fees—just straight-forward
            pricing that scales with your creativity.
          </P>
        </div>

        <PricingTools tools={TOOLS} />

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
    </div>
  );
}
