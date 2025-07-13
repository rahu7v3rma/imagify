"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useFirebase } from "@/context/firebase";

export default function ClientPricingWrapper() {
  const { user } = useFirebase();

  // Re-use the same Stripe link used in the dashboard billing page so we don't duplicate logic.
  const stripeUrl = user?.uid
    ? `https://buy.stripe.com/test_9B6cMYer65B36QXg4j6Ri00?client_reference_id=${user.uid}`
    : "/login";

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
          href={stripeUrl}
          variant="solid"
          color="primary"
          target="_blank"
          rel="noopener noreferrer"
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