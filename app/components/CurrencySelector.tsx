"use client";

import React, { useState } from "react";
import { useCurrency } from "@/app/context/CurrencyContext"; // adjust import path

const currencySymbols = {
  USD: "USD",
  AUD: "AUD",
  EUR: "EUR",
  CAD: "CAD",
  GBP: "GBP",
} as const;

type CurrencyKey = keyof typeof currencySymbols;
const currencyList: CurrencyKey[] = Object.keys(currencySymbols) as CurrencyKey[];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [expanded, setExpanded] = useState<CurrencyKey | null>(null);

  const handleToggle = (cur: CurrencyKey) => {
    setExpanded(expanded === cur ? null : cur);
  };

  const handleSelect = (cur: CurrencyKey) => {
    setCurrency(cur);
    setExpanded(null);
  };

  return (
    <div className="fixed top-1/2 right-0 flex flex-col gap-2 z-[1000] -translate-y-1/2">
      {currencyList.map((cur) => {
        const isExpanded = cur === expanded;
        const isSelected = cur === currency;

        return (
          <div key={cur} className="w-44 flex justify-end">
            <button
              onClick={() => handleToggle(cur)}
              className={`
                cursor-pointer flex items-center overflow-hidden
                ${isExpanded
                  ? "justify-between w-38 px-5 bg-gradient-to-r from-blue-500 to-indigo-800 font-bold text-white"
                  : "justify-center w-15 px-3 bg-gradient-to-r from-indigo-500 to-blue-800 text-white"}
                py-2 h-10 rounded-l-full border-none outline-none transition-all duration-300 ease-in-out shadow-md flex-shrink-0
                ${isSelected ? "ring-2 ring-yellow-300" : ""}
              `}
              title={`Change currency to ${cur}`}
            >
              <span className="inline-flex items-center justify-center flex-shrink-0 h-6 min-w-[24px] rounded-full bg-purple-700 text-white text-xs font-medium -ml-3">
                {cur}
              </span>

              {isExpanded && (
                <span
                  className="ml-3 text-xs opacity-90 select-none whitespace-nowrap cursor-pointer"
                  onClick={() => handleSelect(cur)}
                >
                  {currencySymbols[cur]}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
