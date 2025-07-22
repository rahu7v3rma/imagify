"use client";

import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react";
import { BoltIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useFirebase } from "@/context/firebase";
import { useEffect, useState } from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLoader } from "@/context/loader";
import { getUserCredits } from "@/lib/firebase";

export default function BillingPage() {
  const { userCredits, user, setUserCredits } = useFirebase();
  const router = useRouter();
  const { setIsLoading } = useLoader();

  // Buy credits states - Update minimum to 500 credits ($5.00)
  const [creditAmount, setCreditAmount] = useState(500);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [tempAmount, setTempAmount] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("status");

    // Handle new status parameter from capture endpoint
    if (status) {
      if (status === "success") {
        addToast({
          title: "Payment Successful!",
          description: "Your credits have been added to your account.",
          color: "success",
        });

        // Refresh user credits after successful payment
        if (user) {
          getUserCredits(user.uid)
            .then((credits) => {
              if (credits) {
                setUserCredits(credits);
              }
            })
        }
      } else if (status === "failure") {
        addToast({
          title: "Payment Failed",
          description: "Payment could not be processed. Please try again.",
          color: "danger",
        });
      }

      // Clean up the URL by removing search parameters
      const newUrl = window.location.pathname;
      router.replace(newUrl);

    }
  }, [router, user, setUserCredits]);

  const incrementCredits = () => {
    setCreditAmount((prev) => prev + 1);
  };

  const decrementCredits = () => {
    setCreditAmount((prev) => Math.max(500, prev - 1)); // Minimum 500 credits
  };

  const startEditingAmount = () => {
    setTempAmount(creditAmount.toString());
    setIsEditingAmount(true);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setTempAmount(value);
    }
  };

  const finishEditingAmount = () => {
    const newAmount = parseInt(tempAmount) || 500;
    setCreditAmount(Math.max(500, newAmount)); // Minimum 500 credits
    setIsEditingAmount(false);
    setTempAmount("");
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEditingAmount();
    } else if (e.key === "Escape") {
      setIsEditingAmount(false);
      setTempAmount("");
    }
  };

  const handleBuyCredits = async () => {
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please log in to buy credits",
        color: "danger",
      });
      return;
    }

    // Validate minimum amount on frontend
    if (creditAmount < 500) {
      addToast({
        title: "Minimum Amount Required",
        description: "Minimum purchase amount is 500 credits ($5.00)",
        color: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Calculate amount in dollars (1 credit = $0.01)
      const amountInDollars = creditAmount * 0.01;

      // Make API call to create order
      const response = await axios.post(
        "/dashboard/billing/credits/create-order",
        {
          amount: amountInDollars,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success && response.data.data.paymentLink) {
        addToast({
          title: "Redirecting to Payment Gateway",
          color: "primary",
        });

        // Redirect to Payment Gateway
        window.open(response.data.data.paymentLink, "_blank");
      } else {
        addToast({
          title: "Error",
          description: "Failed to create payment order. Please try again.",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Credits Card */}
              <Card className="w-full">
                <CardBody className="p-6 flex items-center justify-center min-h-[200px]">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total Credits
                    </h3>
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {userCredits?.credits ?? 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Available processing credits
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Buy Credits Card */}
              <Card className="w-full">
                <CardBody className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Buy Credits
                    </h3>

                    {/* Credit Amount Input */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClick={decrementCredits}
                        isDisabled={creditAmount <= 500} // Disable at minimum 500 credits
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>

                      {isEditingAmount ? (
                        <input
                          type="text"
                          value={tempAmount}
                          onChange={handleAmountInputChange}
                          onBlur={finishEditingAmount}
                          onKeyDown={handleAmountKeyDown}
                          className="text-2xl font-bold text-blue-600 dark:text-blue-400 w-[100px] text-center bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="text-2xl font-bold text-blue-600 dark:text-blue-400 w-[100px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 transition-colors"
                          onClick={startEditingAmount}
                        >
                          {creditAmount.toLocaleString()}
                        </div>
                      )}

                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClick={incrementCredits}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price Display */}
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ${(creditAmount * 0.01).toFixed(2)} USD
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Credits to purchase (minimum 500 credits - $5.00)
                    </p>

                    {/* Buy Button */}
                    <Button
                      color="primary"
                      variant="solid"
                      size="md"
                      onClick={handleBuyCredits}
                      className="w-full"
                      isDisabled={creditAmount < 500} // Disable if below minimum
                    >
                      Buy Credits
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* PayPal Security Note */}
            <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
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
        </Tab>
      </Tabs>
    </div>
  );
}
