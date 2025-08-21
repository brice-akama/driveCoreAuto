"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Breadcrumb from "@/app/components/Breadcrumbs";

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const AboutPageComponent: React.FC<Props> = ({ initialLanguage, initialTranslations }) => {
  const { language, translations, setLanguage } = useLanguage();

  // Set SSR language and translations
  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage, "about-us");
  }, [initialLanguage, setLanguage]);

  const t = translations || {};

  return (
             <div className="mt-20 lg:mt-40">
          {/* Full-width black section */}
          <div className="bg-black text-white py-8 text-center w-full">
            <h1 className="text-4xl font-black uppercase">{t.aboutTitle}</h1>
    
            <Breadcrumb />
          </div>
    <main className="max-w-6xl mx-auto px-6 ">

          
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 py-20">
        {/* Left */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-rose-700 uppercase tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-md">{t.heroSubtitle}</p>
        </div>

        {/* Right */}
        <div className="md:w-1/2 bg-gray-50 rounded-2xl shadow-md p-6 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.mainHeading}</h2>
          <p className="text-base text-gray-700 leading-relaxed">{t.mainText}</p>
        </div>
      </section>

      {/* Main About Content */}
      <div className="space-y-8 text-gray-700 leading-relaxed py-12">
        

        {/* Sections */}
        <section>
          <p>{t.intro}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.missionTitle}</h2>
          <p>{t.missionText}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.experienceTitle}</h2>
          <p>{t.experienceText}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.commitmentTitle}</h2>
          <p>{t.commitmentText}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.qualityTitle}</h2>
          <p>{t.qualityText}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.supportTitle}</h2>
          <p>{t.supportText}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.innovationTitle}</h2>
          <p>{t.innovationText}</p>
        </section>
      </div>
    </main>
    </div>
  );
};

export default AboutPageComponent;
