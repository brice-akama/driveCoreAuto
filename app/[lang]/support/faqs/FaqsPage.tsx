"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Breadcrumb from "@/app/components/Breadcrumbs";

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const FAQsPage = ({ initialLanguage, initialTranslations }: Props) => {
  const { language, translations, setLanguage } = useLanguage();

  // set initial SSR language and translations
  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage, "fqas");
  }, [initialLanguage, setLanguage]);

  const t = translations || {};
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleFAQ(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="mt-20 lg:mt-40">
      {/* Black header with breadcrumb */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">{t.pageTitle1}</h1>
        <Breadcrumb />
      </div>

      {/* FAQ content */}
      <div className="py-8 text-gray-800 px-6 lg:px-20 max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold mb-6 pb-2">{t.pageTitle}</h2>

        <div className="space-y-4">
          {t.items?.map((faq: { question: string; answer: string }, index: number) => (
            <div
              key={index}
              className="border border-gray-300 rounded shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center text-lg font-medium focus:outline-none"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
