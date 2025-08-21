"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Breadcrumb from "@/app/components/Breadcrumbs";

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const WarrantyPolicyPage = ({ initialLanguage, initialTranslations }: Props) => {
  const { language, translations, setLanguage } = useLanguage();

  // Set initial SSR language and translations
  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage, "warranty");
  }, [initialLanguage, setLanguage]);

  // Use translations from SSR or client-side switch
  const t = translations?.warrantyPolicy || {};

  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">{t.pageTitle}</h1>

        <Breadcrumb />
      </div>

      {/* Page content with padding */}
      <div className="py-8 px-12 lg:px-20 text-gray-800">
        {/* Page Title */}
        
        <p className="text-center mb-8">{t.intro}</p>
        <hr className="my-6 border-gray-300" />

        {/* Warranty Coverage */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t.warrantyCoverageTitle}</h2>
          <p className="text-red-600 font-semibold mb-2">{t.warrantyCoverageImportant}</p>
          <p>{t.warrantyCoverageDesc}</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            {t.coverageItems?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p className="mt-4">{t.warrantyCoverageDesc}</p>
          <p className="mt-4 font-semibold">{t.nonCoveredPartsTitle}</p>
          <ul className="list-disc pl-5 space-y-1">
            {t.nonCoveredParts?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Installation Requirements */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t.installationTitle}</h2>
          <p>{t.installationDesc}</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            {t.installationItems?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p className="mt-2">{t.installationNote}</p>
        </section>

        {/* Warranty Exclusions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t.warrantyExclusionsTitle}</h2>
          <p>{t.warrantyExclusionsDesc}</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            {t.warrantyExclusionsItems?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Return & Refund Policy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t.returnPolicyTitle}</h2>
          <p>{t.returnPolicyDesc}</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            {t.returnPolicyItems?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">{t.contactTitle}</h2>
          <ul className="space-y-1">
            <li>
              <strong>{t.contactEmail}</strong>{" "}
              <a href={`mailto:${t.contactInfo?.email}`} className="text-blue-600 underline">
                {t.contactInfo?.email}
              </a>
            </li>
            <li>
              <strong>{t.contactPhone}</strong> {t.contactInfo?.phone}
            </li>
            <li>
              <strong>{t.contactWebsite}</strong>{" "}
              <a href={t.contactInfo?.website} className="text-blue-600 underline">
                {t.contactInfo?.website}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm italic">{t.contactNote}</p>
        </section>
      </div>
    </div>
  );
}; // ← Make sure this closing brace is here

export default WarrantyPolicyPage;
