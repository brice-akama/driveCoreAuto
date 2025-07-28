"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

const AboutEnginesSection: React.FC = () => {
  const { translate } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({
    heading: "",
    paragraph1: "",
    paragraph2: "",
    benefitsHeading: "",
    benefit1: "",
    benefit2: "",
    benefit3: "",
    benefit4: "",
    conclusion: "",
  });

  useEffect(() => {
    const translateTexts = async () => {
      const heading = await translate("Reliable Engines & Parts from DriveCore Auto");
      const paragraph1 = await translate("DriveCore Auto supplies high-quality engines, transmissions, suspensions, and accessories sourced from trusted manufacturers. Our products fit many popular vehicle brands including Toyota, Honda, Nissan, Subaru, Mazda, and Mitsubishi.");
      const paragraph2 = await translate("Available for pickup or shipped worldwide to residential and business addresses, our engines meet strict quality standards for durability and performance, making us your trusted partner for automotive parts.");
      const benefitsHeading = await translate("Benefits of Buying an Engine from DriveCore Auto");
      const benefit1 = await translate("Performance: Our engines are designed and tested to provide excellent power and torque, enhancing your vehicle’s driving experience.");
      const benefit2 = await translate("Reliability: Manufactured by renowned brands with strict quality control, our engines are built to last and maintain dependable operation.");
      const benefit3 = await translate("Cost-Effective: Compared to new dealership engines, our carefully selected engines offer a more affordable option without compromising quality.");
      const benefit4 = await translate("Perfect Fit & Customization: Many of our engines are matched specifically to makes and models, simplifying installation and ensuring optimal performance.");
      const conclusion = await translate("Choose DriveCore Auto as your trusted partner for engine supply and experience quality you can rely on.");

      setTranslatedTexts({
        heading,
        paragraph1,
        paragraph2,
        benefitsHeading,
        benefit1,
        benefit2,
        benefit3,
        benefit4,
        conclusion,
      });
    };

    translateTexts();
  }, [translate]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 text-gray-900">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800">
        {translatedTexts.heading || "Reliable Engines & Parts from DriveCore Auto"}
      </h2>

      <p className="max-w-4xl mx-auto text-lg leading-relaxed mb-4">
        {translatedTexts.paragraph1 ||
          "DriveCore Auto supplies high-quality engines, transmissions, suspensions, and accessories sourced from trusted manufacturers. Our products fit many popular vehicle brands including Toyota, Honda, Nissan, Subaru, Mazda, and Mitsubishi."}
      </p>

      <p className="max-w-4xl mx-auto text-lg leading-relaxed mb-12">
        {translatedTexts.paragraph2 ||
          "Available for pickup or shipped worldwide to residential and business addresses, our engines meet strict quality standards for durability and performance, making us your trusted partner for automotive parts."}
      </p>

      <h3 className="text-2xl font-semibold mb-4 text-center">
        {translatedTexts.benefitsHeading || "Benefits of Buying an Engine from DriveCore Auto"}
      </h3>

      <ul className="list-disc list-inside max-w-4xl mx-auto space-y-3 text-lg mb-6">
        <li>{translatedTexts.benefit1 || "Performance: Our engines are designed and tested to provide excellent power and torque, enhancing your vehicle’s driving experience."}</li>
        <li>{translatedTexts.benefit2 || "Reliability: Manufactured by renowned brands with strict quality control, our engines are built to last and maintain dependable operation."}</li>
        <li>{translatedTexts.benefit3 || "Cost-Effective: Compared to new dealership engines, our carefully selected engines offer a more affordable option without compromising quality."}</li>
        <li>{translatedTexts.benefit4 || "Perfect Fit & Customization: Many of our engines are matched specifically to makes and models, simplifying installation and ensuring optimal performance."}</li>
      </ul>

      <p className="max-w-4xl mx-auto text-lg leading-relaxed font-semibold">
        {translatedTexts.conclusion || "Choose DriveCore Auto as your trusted partner for engine supply and experience quality you can rely on."}
      </p>
    </section>
  );
};

export default AboutEnginesSection;
