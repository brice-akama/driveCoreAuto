"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Breadcrumb from "@/app/components/Breadcrumbs";

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const BuyerServices = ({ initialLanguage, initialTranslations }: Props) => {
  const { language, translations, setLanguage } = useLanguage();

  // Set initial SSR language and translations
  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage, "buyer-services");
  }, [initialLanguage, setLanguage]);

  // Use translations from SSR or client-side switch
  const t = translations || {};

  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">{t.title}</h1>
        <Breadcrumb />
      </div>

      <div className="py-8 text-gray-800 px-12 lg:px-20">
        <h2 className="text-4xl font-semibold mb-6 pb-2 whitespace-nowrap">
          {t.title}
        </h2>

        <div className="space-y-6 leading-relaxed">
          <p>{t.intro}</p>

          <p>
            <strong>{t.productConsultation}</strong>: {t.productConsultationText}
          </p>

          <p>
            <strong>{t.compatibilitySupport}</strong>: {t.compatibilitySupportText}
          </p>

          <p>
            <strong>{t.installationGuidance}</strong>: {t.installationGuidanceText}
          </p>

          <p>
            <strong>{t.orderTracking}</strong>: {t.orderTrackingText}
          </p>

          <p>
            <strong>{t.returns}</strong>: {t.returnsText}
          </p>

          <p>
            <strong>{t.afterSales}</strong>: {t.afterSalesText}
          </p>

          <p>
            <strong>{t.customOrders}</strong>: {t.customOrdersText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyerServices;
