"use client";

import React, { useEffect, useState } from "react";

interface Props {
  initialLanguage: string;
  initialTranslations: any;
}

const AboutEnginesSection: React.FC<Props> = ({ initialLanguage, initialTranslations }) => {
  const [texts, setTexts] = useState(initialTranslations.aboutEngines || {});

  useEffect(() => {
    setTexts(initialTranslations.aboutEngines || {});
  }, [initialTranslations]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 text-gray-900">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800">
        {texts.heading}
      </h2>
      <p className="max-w-4xl mx-auto text-lg leading-relaxed mb-4">
        {texts.paragraph1}
      </p>
      <p className="max-w-4xl mx-auto text-lg leading-relaxed mb-12">
        {texts.paragraph2}
      </p>
      <h3 className="text-2xl font-semibold mb-4 text-center">
        {texts.benefitsHeading}
      </h3>
      <ul className="list-disc list-inside max-w-4xl mx-auto space-y-3 text-lg mb-6">
        <li>{texts.benefit1}</li>
        <li>{texts.benefit2}</li>
        <li>{texts.benefit3}</li>
        <li>{texts.benefit4}</li>
      </ul>
      <p className="max-w-4xl mx-auto text-lg leading-relaxed font-semibold">
        {texts.conclusion}
      </p>
    </section>
  );
};

export default AboutEnginesSection;
