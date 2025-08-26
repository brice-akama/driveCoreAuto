"use client";
import Breadcrumb from "@/app/components/Breadcrumbs";
import React from "react";

interface CookiePolicyProps {
  initialLanguage: string;
  initialTranslations: {
    title: string;
    lastUpdated: string;
    intro: string;
    toc: Record<string, string>;
    sections: Record<string, string>;
  };
}

const CookiePolicyPage: React.FC<CookiePolicyProps> = ({ initialLanguage, initialTranslations }) => {
  const t = initialTranslations;

  return (
    <div className="mt-20 lg:mt-40">
          {/* Full-width black section */}
          <div className="bg-black text-white py-8 text-center w-full">
            <h1 className="text-4xl font-black">{t.title}</h1>
    
            <Breadcrumb />
          </div>
    <main className="max-w-5xl mx-auto px-6  pb-24 text-gray-800 mt-10">
      

      <p className="text-sm text-gray-500 ">{t.lastUpdated}</p>

      <section className="space-y-4 mb-10">
        <p>{t.intro}</p>
      </section>

      <nav className="mb-10">
        <ul className="list-disc pl-6 space-y-2 text-sm">
          {(Object.entries(t.toc) as [string, string][]).map(([key, label]) => (
            <li key={key}>
              <a href={`#${key}`} className="underline">{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {(Object.entries(t.sections) as [string, string][]).map(([key, content]) => (
        <section key={key} id={key} className="space-y-4 mb-10">
          <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
            {t.toc[key]}
          </div>
          <p>{content}</p>
        </section>
      ))}

      
    </main>
    </div>
  );
};

export default CookiePolicyPage;
