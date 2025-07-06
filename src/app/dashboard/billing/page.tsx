"use client";

import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { useFirebase } from "@/context/firebase";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

export default function BillingPage() {
  const { userCredits, user } = useFirebase();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");

    if (paymentStatus) {
      // Show toast based on payment status
      if (paymentStatus === "success") {
        // Success toast
        const successMessage = amount 
          ? `Payment successful! $${(parseInt(amount) / 100).toFixed(2)} charged.`
          : "Payment successful!";
        
        addToast({
          title: successMessage,
          color: "success",
        });
      } else if (paymentStatus === "failed") {
        // Failed toast
        const failedMessage = message || "Payment failed. Please try again.";
        addToast({
          title: "Payment Failed",
          description: failedMessage,
          color: "danger",
        });
      } else if (paymentStatus === "error") {
        // Error toast
        const errorMessage = message || "An error occurred during payment verification.";
        addToast({
          title: "Error",
          description: errorMessage,
          color: "danger",
        });
      }

      // Clean up the URL by removing search parameters
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  // Generate Stripe URL with Firebase user ID
  const stripeUrl = user?.uid 
    ? `https://buy.stripe.com/test_9B6cMYer65B36QXg4j6Ri00?client_reference_id=${user.uid}`
    : "#";

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Billing</h1>

      <Tabs aria-label="Billing tabs" color="primary" variant="underlined">
        <Tab
          key="credits"
          title={
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-4 h-4" />
              <span>Credits</span>
            </div>
          }
        >
          <div className="py-4">
            <Card className="max-w-full">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Credits
                  </h3>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 ml-8">
                    {userCredits?.credits ?? 0}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    variant="solid"
                    size="sm"
                    as="a"
                    href={stripeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    isDisabled={!user?.uid}
                  >
                    Buy Credits
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
