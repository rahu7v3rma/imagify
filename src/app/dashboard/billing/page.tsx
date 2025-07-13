"use client";

import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { useFirebase } from "@/context/firebase";
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const { userCredits, user } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentStatus = searchParams.get("payment");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");

    if (paymentStatus) {
      // Show toast based on payment status
      if (paymentStatus === "success") {
        // Success toast
        const successMessage = amount
          ? `Payment successful! $${(parseInt(amount) / 100).toFixed(
              2,
            )} charged.`
          : "Payment successful!";

        addToast({
          title: successMessage,
          color: "success",
        });
      } else if (paymentStatus === "failed") {
        // Failed toast
        addToast({
          title: "Payment Failed",
          description: "Payment failed. Please try again.",
          color: "danger",
        });
      } else if (paymentStatus === "error") {
        // Error toast
        addToast({
          title: "Error",
          description: "An error occurred during payment verification.",
          color: "danger",
        });
      }

      // Clean up the URL by removing search parameters
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [router]);

  // TODO: Configure payment processor URL
  const paymentUrl = "#";

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
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    isDisabled={true}
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
