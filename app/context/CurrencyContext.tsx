"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "AUD" | "EUR" | "CAD" | "GBP";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  AUD: "A$",
  EUR: "€",
  CAD: "C$",
  GBP: "£",
};

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  symbol: string;
  conversionRate: number; // Add this for multiplying product prices
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [conversionRate, setConversionRate] = useState<number>(1); // Default: 1:1

  // Load saved currency
  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency") as Currency;
    if (storedCurrency && currencySymbols[storedCurrency]) {
      setCurrency(storedCurrency);
    }
  }, []);

  // Save currency to localStorage
  useEffect(() => {
  const fetchRate = async () => {
    const cacheKey = `rate-${currency}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setConversionRate(parseFloat(cached));
      return;
    }

    try {
      const res = await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currency}`);
      const data = await res.json();

      const rate = data?.info?.rate || 1; // ✅ FIXED here
      console.log("Exchange rate fetched:", rate);

      setConversionRate(rate);
      localStorage.setItem(cacheKey, rate.toString());
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      setConversionRate(1);
    }
  };

  if (currency === "USD") {
    setConversionRate(1);
  } else {
    fetchRate();
  }
}, [currency]);


  const value = {
    currency,
    setCurrency,
    symbol: currencySymbols[currency],
    conversionRate,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
