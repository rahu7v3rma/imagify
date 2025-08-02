"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/button";
import { Zap, Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function BillingPage() {
  const [creditAmount, setCreditAmount] = useState(500);

  const handleBuyCredits = async () => {};

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      <Tabs defaultValue="credits" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="credits" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Credits</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="credits">
          <div className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="w-full">
                <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Total Credits
                    </h3>
                    <div className="text-4xl font-bold text-primary">
                      {0}
                    </div>
                    <p className="text-sm text-gray-600">
                      Available processing credits
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Buy Credits
                    </h3>

                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setCreditAmount((prev) => Math.max(500, prev - 100))
                        }
                        disabled={creditAmount <= 500}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <div className="text-2xl font-bold text-blue-600 w-[100px] text-center bg-transparent border-b-2 border-blue-500 px-2 py-1">
                        {creditAmount}
                      </div>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setCreditAmount((prev) => prev + 100)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-lg font-semibold text-green-600">
                      ${(creditAmount * 0.01).toFixed(2)} USD
                    </div>

                    <p className="text-sm text-gray-600">
                      Credits to purchase (minimum 500 credits - $5.00)
                    </p>

                    <Button
                      onClick={handleBuyCredits}
                      className="w-full"
                      disabled={creditAmount < 500}
                    >
                      Buy Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-8 border-t border-gray-200 mt-8">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
