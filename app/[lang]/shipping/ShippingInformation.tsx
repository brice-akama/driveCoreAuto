"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const ShippingInformation = ({ initialLanguage, initialTranslations }: Props) => {
  const { language, translations, setLanguage } = useLanguage();

  // Set initial SSR language and translations
  useEffect(() => {
  if (initialLanguage) setLanguage(initialLanguage, "shipping");
}, [initialLanguage, setLanguage]);

  // Use translations from SSR or client-side switch
  const t = translations || {};

  return (
    <div className="py-8 text-gray-800 mt-20 lg:mt-40 px-12 lg:px-20">
      <h2 className="text-4xl font-semibold mb-6 pb-2 whitespace-nowrap">{t.pageTitle}</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.importantNoteTitle}</h3>
        <p dangerouslySetInnerHTML={{ __html: t.importantNoteDesc }} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.deliveryTitle}</h3>
        <ul className="list-disc pl-6 space-y-2">
          {t.deliveryItems?.map((item: string, idx: number) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.shippingCostTitle}</h3>
        <ul className="list-disc pl-6 space-y-2">
          {t.shippingCostItems?.map((item: string, idx: number) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.puertoRicoTitle}</h3>
        <p dangerouslySetInnerHTML={{ __html: t.puertoRicoDesc }} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.beforeSigningTitle}</h3>
        <ul className="list-disc pl-6 space-y-2">
          {t.beforeSigningItems?.map((item: string, idx: number) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">{t.internationalTitle}</h3>
        {t.internationalDesc?.map((item: string, idx: number) => (
          <p key={idx} className={idx === 1 ? "mt-2" : ""} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </div>
    </div>
  );
};

export default ShippingInformation;
