"use client";

import React, { useEffect, useState } from "react";

interface Props {
  initialLanguage: string;
  initialTranslations: any;
}

const DescriptionsHome: React.FC<Props> = ({ initialLanguage, initialTranslations }) => {
  const [texts, setTexts] = useState<any>({});

  useEffect(() => {
    setTexts(initialTranslations || {});
  }, [initialTranslations]);

  if (!texts) return null;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column */}
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">{texts.whyChooseHeading}</h2>
          <p className="mb-4 text-lg text-gray-700">{texts.intro}</p>

          <h3 className="text-xl font-semibold mb-2">{texts.expertiseTitle}</h3>
          <p className="mb-4 text-lg text-gray-700">{texts.expertiseText}</p>
           
           

          <h3 className="text-xl font-semibold mb-2">{texts.qualityTitle}</h3>
          <p className="text-lg text-gray-700">{texts.qualityText}</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">{texts.commitmentHeading}</h2>

          <h3 className="text-xl font-semibold mb-2">{texts.transparencyTitle}</h3>
          <p className="mb-4 text-lg text-gray-700">{texts.transparencyText}</p>

          <h3 className="text-xl font-semibold mb-2">{texts.customerFocusTitle}</h3>
          <p className="mb-4 text-lg text-gray-700">{texts.customerFocusText}</p>
         <div
  role="heading"
  aria-level={3}
  className="text-xl font-semibold mt-10"
>
{texts.qualityAssuranceTitle}
</div>
          
          <ul className="space-y-4 list-disc list-inside text-lg text-gray-700">
            {texts.qualityAssuranceItems?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6 whitespace-nowrap">{texts.valuesHeading}</h2>
          <ul className="space-y-4 list-disc list-inside text-lg text-gray-700">
            {texts.valuesItems?.map((item: any, idx: number) => (
              <li key={idx}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">{texts.faqHeading}</h2>
          <ul className="space-y-4 list-disc list-inside text-lg text-gray-700">
            {texts.faqItems?.map((item: any, idx: number) => (
              <li key={idx}>
                <strong>{item.question}</strong> {item.answer}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DescriptionsHome;
