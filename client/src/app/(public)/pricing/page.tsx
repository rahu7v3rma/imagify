import { ButtonWrapper } from "@/components/buttons";
import Link from "next/link";
import { TOOLS } from "@/constants/dashboard/pricing";
import { ROUTES } from "@/constants/routes";

export default async function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      <div className="text-center space-y-2 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Simple, pay-as-you-go pricing
        </h1>
        <p className="text-base">
          Purchase prepaid processing credits and use them across any tool. No
          subscriptions, surprise bills, or hidden fees—just straight-forward
          pricing that scales with your creativity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {TOOLS.map(({ icon: Icon, title, description, cost }) => (
          <div
            key={title}
            className="flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground text-center">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground text-center">
              {description}
            </p>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {cost}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-semibold">Ready to get started?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Create a free account and top-up credits whenever you need them.
        </p>
        <ButtonWrapper variant="default" className="text-xs">
          <Link href={ROUTES.SIGNUP}>Sign Up – It's Free</Link>
        </ButtonWrapper>
      </div>
    </div>
  );
}
