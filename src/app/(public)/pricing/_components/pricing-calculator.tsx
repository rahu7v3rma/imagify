"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Button,
    Autocomplete,
    AutocompleteItem,
    Chip
} from "@heroui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { Currency, ExchangeRateData } from "@/lib/firebase-admin";

interface PricingCalculatorProps {
    exchangeRateData: ExchangeRateData | null;
}

export default function PricingCalculator({ exchangeRateData }: PricingCalculatorProps) {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [credits, setCredits] = useState(100);
    const [amount, setAmount] = useState(1);
    const [isEditingCredits, setIsEditingCredits] = useState(false);
    const [tempCredits, setTempCredits] = useState("");

    // Set currencies and default currency on component mount
    useEffect(() => {
        if (exchangeRateData) {
            setCurrencies(exchangeRateData.currencies);
            // Set USD as default currency
            const usdCurrency = exchangeRateData.currencies.find(c => c.code === "USD");
            if (usdCurrency) {
                setSelectedCurrency(usdCurrency);
            }
        }
    }, [exchangeRateData]);

    // Update amount when credits change
    useEffect(() => {
        if (selectedCurrency) {
            const newAmount = (credits / 100) * selectedCurrency.rate;
            setAmount(Math.round(newAmount * 100) / 100); // Round to 2 decimal places
        }
    }, [credits, selectedCurrency]);

    const handleCurrencyChange = (key: string) => {
        const currency = currencies.find(c => c.code === key);
        if (currency) {
            setSelectedCurrency(currency);
        }
    };

    const incrementCredits = () => {
        setCredits(prev => prev + 1);
    };

    const decrementCredits = () => {
        setCredits(prev => Math.max(1, prev - 1));
    };

    const startEditingCredits = () => {
        setTempCredits(credits.toString());
        setIsEditingCredits(true);
    };

    const handleCreditsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers
        if (value === "" || /^\d+$/.test(value)) {
            setTempCredits(value);
        }
    };

    const finishEditingCredits = () => {
        const newCredits = parseInt(tempCredits) || 1;
        setCredits(Math.max(1, newCredits));
        setIsEditingCredits(false);
        setTempCredits("");
    };

    const handleCreditsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            finishEditingCredits();
        } else if (e.key === 'Escape') {
            setIsEditingCredits(false);
            setTempCredits("");
        }
    };

    if (!exchangeRateData || currencies.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-zinc-400">
                        {!exchangeRateData ? "Unable to load exchange rates" : "Loading calculator..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold dark:text-white">
                    Pricing Calculator
                </h2>
                <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-md mx-auto">
                    💡 These are estimates updated daily at midnight UTC. The most accurate
                    results will be displayed while making payment.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Currency Selection */}
                <div className="mb-6 max-w-xs mx-auto">
                    <Autocomplete
                        label="Select Currency"
                        placeholder="Search for currency..."
                        selectedKey={selectedCurrency?.code}
                        onSelectionChange={(key) => handleCurrencyChange(key as string)}
                        classNames={{
                            base: [
                                "w-full",
                                "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500",
                                "dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400",
                                "bg-default-50 dark:bg-zinc-800/50",
                                "transition-colors duration-200",
                                "rounded-lg",
                            ],
                            selectorButton: "text-default-600 dark:text-zinc-300",
                        }}
                    >
                        {currencies.map((currency) => (
                            <AutocompleteItem key={currency.code}>
                                {currency.label}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>

                {/* Calculator Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Credits Card */}
                    <Card className="w-full">
                        <CardBody className="text-center space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold dark:text-white">Credits</h3>
                                <Chip color="secondary" variant="flat" size="sm">
                                    Processing Credits
                                </Chip>
                            </div>

                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    onClick={decrementCredits}
                                    isDisabled={credits <= 1}
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </Button>

                                {isEditingCredits ? (
                                    <input
                                        type="text"
                                        value={tempCredits}
                                        onChange={handleCreditsInputChange}
                                        onBlur={finishEditingCredits}
                                        onKeyDown={handleCreditsKeyDown}
                                        className="text-3xl font-bold text-blue-600 dark:text-blue-400 w-[80px] text-center bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        className="text-3xl font-bold text-blue-600 dark:text-blue-400 w-[80px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 transition-colors"
                                        onClick={startEditingCredits}
                                    >
                                        {credits.toLocaleString()}
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

                            <p className="text-sm text-gray-600 dark:text-zinc-400">
                                Use across all AI tools
                            </p>
                        </CardBody>
                    </Card>

                    {/* Amount Card */}
                    <Card className="w-full">
                        <CardBody className="text-center space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold dark:text-white">Amount</h3>
                                <Chip color="primary" variant="flat" size="sm">
                                    {selectedCurrency?.label || "USD"}
                                </Chip>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 min-w-[120px]">
                                    {amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-zinc-400">
                                Total cost in {selectedCurrency?.label || "USD"}
                            </p>
                        </CardBody>
                    </Card>
                </div>


            </div>
        </div>
    );
} 