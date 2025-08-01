import { Button } from "@heroui/react";
import Link from "next/link";
import { tools } from "@/constants/dashboard/pricing";
import { ROUTES } from "@/constants/routes";

export default async function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-12 text-gray-800 dark:text-zinc-200">
      <div className="text-center space-y-2 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
          Simple, pay-as-you-go pricing
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Purchase prepaid processing credits and use them across any tool. No
          subscriptions, surprise bills, or hidden fees—just straight-forward
          pricing that scales with your creativity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map(({ icon: Icon, title, description, cost }) => (
          <div
            key={title}
            className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {description}
            </p>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              💳 {cost}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-semibold dark:text-white">
          Ready to get started?
        </h2>
        <p className="text-gray-600 dark:text-zinc-400 max-w-xl mx-auto">
          Create a free account and top-up credits whenever you need them.
        </p>
        <Button as={Link} href={ROUTES.SIGNUP} variant="solid" color="primary">
          Sign Up – It's Free
        </Button>
      </div>

      <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          All payments are secured through our trusted payment processors
        </p>
      </div>
    </div>
  );
}
