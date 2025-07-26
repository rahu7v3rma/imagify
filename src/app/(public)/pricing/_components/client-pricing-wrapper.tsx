"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useUser } from "@/context/user";

export default function ClientPricingWrapper() {
  const { user } = useUser();

  return (
    <div className="text-center space-y-4 pt-4">
      <h2 className="text-2xl font-semibold dark:text-white">
        Ready to get started?
      </h2>
      <p className="text-gray-600 dark:text-zinc-400 max-w-xl mx-auto">
        Create a free account and top-up credits whenever you need them.
      </p>
      {user ? (
        <Button
          as="a"
          href="/dashboard/billing"
          variant="solid"
          color="primary"
        >
          Buy Credits
        </Button>
      ) : (
        <Button as={Link} href="/signup" variant="solid" color="primary">
          Sign Up – It's Free
        </Button>
      )}
    </div>
  );
}
