"use client";
import Breadcrumb from "@/app/components/Breadcrumbs";
import React from "react";

interface Props {
  initialTranslations: Record<string, any>;
}

const PrivacyPolicyContent: React.FC<Props> = ({ initialTranslations }) => {
  const t = initialTranslations;

  return (
    <div className="mt-20 lg:mt-40">
          {/* Full-width black section */}
          <div className="bg-black text-white py-8 text-center w-full">
            <h1 className="text-4xl font-black">{t.title}</h1>
    
            <Breadcrumb />
          </div>
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      
      <p className="mb-6">{t.intro}</p>

      {[...Array(9)].map((_, i) => (
        <section key={i} className="mb-6">
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t[`section${i+1}Title`]}</h2>
          <p>{t[`section${i+1}Text`]}</p>
        </section>
      ))}
    </div>
    </div>
  );
};

export default PrivacyPolicyContent;
