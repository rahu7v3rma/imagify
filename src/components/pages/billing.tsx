"use client";

import PageTransition from "@/components/shared/transitions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1, H3, H4, Muted, Large, List } from "@/components/ui/typography";
import { Button } from "@/components/shared/buttons";
import { NumberInput } from "@/components/shared/inputs";
import { Zap, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ErrorAlert, SuccessAlert } from "@/components/shared/alerts";
import {
  WithLoaderNode,
  WithLoaderNodeSafe,
} from "@/components/shared/loaders";
import { trpc } from "@/lib/trpc/client";
import { useUser } from "@/context/user/provider";
import { BILLING_CONSTANTS } from "@/constants/credits";

// Local schema copied from pricing page reference
const PurchaseSchema = z.object({
  amount: z
    .number()
    .min(
      BILLING_CONSTANTS.MIN_CREDITS / 100,
      `Amount must be at least $${BILLING_CONSTANTS.MIN_CREDITS / 100}`
    )
    .max(100, "Amount must be at most $100"),
  credits: z
    .number()
    .min(
      BILLING_CONSTANTS.MIN_CREDITS,
      `Credits must be at least ${BILLING_CONSTANTS.MIN_CREDITS}`
    )
    .max(10000, "Credits must be at most 10000"),
});

// Buy Credits form component (placed above BillingPage)
function BuyCreditsForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Effect to check search params for success/failure messages
  useEffect(() => {
    const buyCreditsSuccess = searchParams.get("buy_credits_success");
    const buyCreditsFailure = searchParams.get("buy_credits_failure");

    if (buyCreditsSuccess === "1") {
      setSuccessMessage(
        "Payment completed successfully! Your credits have been added to your account."
      );
      setErrorMessage(null);
    } else if (buyCreditsFailure === "1") {
      setErrorMessage("Payment failed or was cancelled. Please try again.");
      setSuccessMessage(null);
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    mode: "onChange",
    defaultValues: {
      amount: BILLING_CONSTANTS.MIN_CREDITS / 100,
      credits: BILLING_CONSTANTS.MIN_CREDITS,
    },
  });

  const { mutate, isPending } = trpc.billing.createOrder.useMutation({
    onSuccess: (data) => {
      if (data.success && data.data?.paymentUrl) {
        setSuccessMessage(
          data.message ||
            "Order created successfully! Redirecting to payment..."
        );
        setErrorMessage(null);
        // Redirect to PayPal payment URL
        window.open(data.data.paymentUrl, "_blank");
      } else {
        setErrorMessage(
          data.message || "Failed to create order. Please try again."
        );
        setSuccessMessage(null);
      }
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to create order. Please try again."
      );
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: z.infer<typeof PurchaseSchema>) => {
    mutate({ amount: data.amount });
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseFloat(value) : 0;
    form.setValue("amount", numValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("credits", Math.round(numValue * 100), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleCreditsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value) : 0;
    form.setValue("credits", numValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("amount", parseFloat((numValue / 100).toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const values = form.watch();
  const amount = values.amount ?? 0;
  const credits = values.credits ?? 0;
  const errors = form.formState.errors;
  const amountError = errors.amount?.message;
  const creditsError = errors.credits?.message;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>
          Buy processing credits to use across all tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <NumberInput
            label="Amount (USD)"
            value={(amount ?? 0).toString()}
            onChange={handleAmountChange}
            min={BILLING_CONSTANTS.MIN_CREDITS / 100}
            step={1}
            placeholder="Enter amount in USD"
            error={amountError}
          />
          <NumberInput
            label="Credits"
            value={(credits ?? 0).toString()}
            onChange={handleCreditsChange}
            min={BILLING_CONSTANTS.MIN_CREDITS}
            step={100}
            placeholder="Enter number of credits"
            error={creditsError}
          />
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isPending}
          >
            <WithLoaderNode content="Buy Credits" isLoading={isPending} />
          </Button>
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}
        </form>
      </CardContent>
    </Card>
  );
}

// Buy Subscription form component
function BuySubscriptionForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Effect to check search params for success/failure messages
  useEffect(() => {
    const buySubscriptionSuccess = searchParams.get("buy_subscription_success");
    const buySubscriptionFailure = searchParams.get("buy_subscription_failure");

    if (buySubscriptionSuccess === "1") {
      setSuccessMessage(
        "Subscription created successfully! You now have access to premium features."
      );
      setErrorMessage(null);
    } else if (buySubscriptionFailure === "1") {
      setErrorMessage(
        "Subscription failed or was cancelled. Please try again."
      );
      setSuccessMessage(null);
    }
  }, [searchParams]);

  const { mutate, isPending } = trpc.billing.createSubscription.useMutation({
    onSuccess: (data) => {
      if (data.success && data.data?.approvalUrl) {
        setSuccessMessage(
          data.message ||
            "Subscription created successfully! Redirecting to payment..."
        );
        setErrorMessage(null);
        // Redirect to PayPal subscription URL
        window.open(data.data.approvalUrl, "_blank");
      } else {
        setErrorMessage(
          data.message || "Failed to create subscription. Please try again."
        );
        setSuccessMessage(null);
      }
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to create subscription. Please try again."
      );
      setSuccessMessage(null);
    },
  });

  const handleSubscribe = () => {
    mutate();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Standard Plan</CardTitle>
        <CardDescription>Most value for your money</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Large className="text-black font-bold !text-2xl">$10</Large>
            <Muted>/month</Muted>
          </div>
          <List
            options={[
              <Muted key="credits">1000 credits per month</Muted>,
              <Muted key="links">Share processed image links</Muted>,
              <Muted key="history">Save image history</Muted>,
            ]}
            className=""
          />
          <Button
            type="button"
            variant="default"
            className="w-full"
            disabled={isPending}
            onClick={handleSubscribe}
          >
            <WithLoaderNode content="Subscribe" isLoading={isPending} />
          </Button>
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}
        </div>
      </CardContent>
    </Card>
  );
}

// Current Subscription card component
function CurrentSubscriptionCard() {
  const { userProfile, isLoading } = useUser();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
        <CardDescription>Your subscription details</CardDescription>
      </CardHeader>
      <CardContent>
        <WithLoaderNodeSafe
          content={
            userProfile?.subscriptionPlanName ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Muted>Plan</Muted>
                    <H4 className="!text-lg !mt-0">
                      {userProfile?.subscriptionPlanName}
                    </H4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Muted>Status</Muted>
                    <H4 className="!text-lg !mt-0">
                      {userProfile?.subscriptionActive ? "Active" : "Inactive"}
                    </H4>
                  </div>
                  {userProfile?.subscriptionCredits && (
                    <div className="flex items-center gap-2">
                      <Muted>Credits</Muted>
                      <H4 className="!text-lg !mt-0">
                        {userProfile.subscriptionCredits}
                      </H4>
                    </div>
                  )}
                  {userProfile?.subscriptionCreditResetDate && (
                    <div className="flex items-center gap-2">
                      <Muted>Next reset</Muted>
                      <H4 className="!text-lg !mt-0">
                        {new Date(
                          userProfile.subscriptionCreditResetDate
                        ).toLocaleDateString()}
                      </H4>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Muted>No active subscription</Muted>
              </div>
            )
          }
          fallback={
            <div className="text-center py-4">
              <Muted>Loading subscription details...</Muted>
            </div>
          }
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  const { userProfile, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<string>("credits");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <PageTransition className="">
      <div className="w-full">
        <div className="mb-6 flex justify-start">
          <H1>Billing</H1>
        </div>

        <Tabs defaultValue="credits" className="w-full" value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="credits"
              className="flex items-center space-x-2"
              onClick={() => setActiveTab("credits")}
            >
              <Zap className="w-4 h-4" />
              <span>Credits</span>
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="flex items-center space-x-2"
              onClick={() => setActiveTab("subscription")}
            >
              <CreditCard className="w-4 h-4" />
              <span>Subscription</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="credits">
            <div className="py-4">
              <div className="flex gap-4">
                <Card className="w-max h-max">
                  <CardContent className="p-6 flex items-center justify-start">
                    <div className="space-y-4 flex flex-col items-start w-max">
                      <div>
                        <H3>Total Credits</H3>
                        <Muted>Available processing credits</Muted>
                      </div>
                      <WithLoaderNodeSafe
                        content={<H1>{userProfile?.credits ?? 0}</H1>}
                        fallback={<H1>0</H1>}
                        isLoading={isLoading}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Buy Credits Form (reference applied from pricing page) */}
                <BuyCreditsForm />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="subscription">
            <div className="py-4">
              {userProfile?.subscriptionPlanName ? (
                <CurrentSubscriptionCard />
              ) : (
                <BuySubscriptionForm />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
