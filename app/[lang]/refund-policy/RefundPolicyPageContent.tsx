"use client";
import Breadcrumb from "@/app/components/Breadcrumbs";
import React from "react";

interface Props {
  initialTranslations: Record<string, any>;
}

const RefundPolicyPageContent: React.FC<Props> = ({ initialTranslations }) => {
  const t = initialTranslations;

  return (
    <div className="mt-20 lg:mt-40">
          {/* Full-width black section */}
          <div className="bg-black text-white py-8 text-center w-full">
            <h1 className="text-4xl font-black">{t.title}</h1>
    
            <Breadcrumb />
          </div>
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">{t.title}</h1>

      {[1,2,3,4,5].map((i) => (
        <section key={i} className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{t[`section${i}Title`]}</h2>
          <p className="text-gray-700 leading-relaxed">{t[`section${i}Text`]}</p>
        </section>
      ))}
    </main>
    </div>
  );
};

export default RefundPolicyPageContent;
