// app/support/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const SupportPage: React.FC = () => {
  const { translate, language } = useLanguage();

  const [translatedTexts, setTranslatedTexts] = useState({
    heroTitle: "DriveCore Auto Support",
    heroSubtitle: "Need help? Explore FAQs, Services, or Contact",
    faqsTitle: "FAQs",
    faqsDescription:
      "Find answers to the most common questions about our engines, swaps, transmissions, and services.",
    faqsButton: "View FAQs",
    buyerTitle: "Buyer Services",
    buyerDescription:
      "Get help with orders, returns, shipping, and product inquiries.",
    buyerButton: "Visit Buyer Services",
    contactTitle: "Contact Us",
    contactEmailLabel: "Email",
    contactLiveChat:
      "Live Chat: Click the chat icon at the bottom right of the page to talk to us instantly.",
  });

  useEffect(() => {
    async function translateTexts() {
      const heroTitle = await translate("DriveCore Auto Support");
      const heroSubtitle = await translate(
        "Need help? Explore FAQs, Services, or Contact"
      );
      const faqsTitle = await translate("FAQs");
      const faqsDescription = await translate(
        "Find answers to the most common questions about our engines, swaps, transmissions, and services."
      );
      const faqsButton = await translate("View FAQs");
      const buyerTitle = await translate("Buyer Services");
      const buyerDescription = await translate(
        "Get help with orders, returns, shipping, and product inquiries."
      );
      const buyerButton = await translate("Visit Buyer Services");
      const contactTitle = await translate("Contact Us");
      const contactEmailLabel = await translate("Email");
      const contactLiveChat = await translate(
        "Live Chat: Click the chat icon at the bottom right of the page to talk to us instantly."
      );

      setTranslatedTexts({
        heroTitle,
        heroSubtitle,
        faqsTitle,
        faqsDescription,
        faqsButton,
        buyerTitle,
        buyerDescription,
        buyerButton,
        contactTitle,
        contactEmailLabel,
        contactLiveChat,
      });
    }
    translateTexts();
  }, [language, translate]);

  return (
    <div className="min-h-screen bg-gray-50 mt-20 lg:mt-40">
      {/* Hero / Header */}
      <div className="bg-black text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">{translatedTexts.heroTitle}</h1>
        <p className="text-lg">{translatedTexts.heroSubtitle}</p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* FAQs */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">{translatedTexts.faqsTitle}</h2>
          <p className="mb-6">{translatedTexts.faqsDescription}</p>
          <Link
  href={`/${language}/support/faqs`}
  className="inline-block bg-blue-800 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
>
  {translatedTexts.faqsButton}
</Link>
        </div>

        {/* Buyer Services */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">{translatedTexts.buyerTitle}</h2>
          <p className="mb-6">{translatedTexts.buyerDescription}</p>
<Link
    href={`/${language}/support/buyer-services`}
    className="inline-block bg-blue-800 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
  >
    {translatedTexts.buyerButton}
  </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">{translatedTexts.contactTitle}</h2>
        <p className="mb-2">
          {translatedTexts.contactEmailLabel}:{" "}
          <a href="mailto:support@drivecoreauto.com" className="text-blue-800 underline">
            support@drivecoreauto.com
          </a>
        </p>
        <p>{translatedTexts.contactLiveChat}</p>
      </div>
    </div>
  );
};

export default SupportPage;
