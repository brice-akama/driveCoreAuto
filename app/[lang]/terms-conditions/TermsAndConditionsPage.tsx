"use client";
import React from "react";
import Breadcrumb from "@/app/components/Breadcrumbs"; // adjust path
import Link from "next/link";

interface TermsProps {
  initialLanguage: string;
  initialTranslations: {
    title: string;
    intro: string;
    sections: Record<string, { heading: string; content: string }>;
  };
}

const TermsAndConditionsPage: React.FC<TermsProps> = ({ initialLanguage, initialTranslations }) => {
  const t = initialTranslations;

  return (
    <div className="mt-20 lg:mt-40"> 
    <div className="bg-black text-white py-8 w-full text-center">
        <h1 className="text-4xl font-black uppercase">{t.title}</h1>
        <Breadcrumb />
      </div>

    <div className="max-w-5xl mx-auto p-6">
      
      <div className="space-y-8 text-gray-800">
        <p className="text-lg">{t.intro}</p>

        {Object.entries(t.sections).map(([key, section]) => (
          <section key={key} className="space-y-4">
            <h2 className="text-2xl font-bold">{section.heading}</h2>
            <p>{section.content}</p>
          </section>
        ))}

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p>
            If you have any questions or concerns about these Terms, please contact us at:
          </p>
          <p>
            <strong>DriveCore Auto</strong><br />
            Email: <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a><br />
            Address: USA
          </p>
        </section>
      </div>
    </div>
    </div>
  );
};

export default TermsAndConditionsPage;
