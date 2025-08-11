// app/shipping-policy/page.tsx
import { Metadata } from "next";
import React from "react";
import ShippingInformation from "./ShippingInformation";

const metaTranslations = {
  title: {
    en: "Shipping Policy - 16Zips",
    fr: "Politique d'expédition - 16Zips",
    es: "Política de Envío - 16Zips",
    de: "Versandrichtlinie - 16Zips",
  },
  description: {
    en: "Learn about our shipping policy, including delivery times, areas served, shipping methods, and what to expect when ordering cannabis from 16Zips.",
    fr: "Découvrez notre politique d'expédition, y compris les délais de livraison, les zones desservies, les méthodes d'expédition, et à quoi s'attendre lors de la commande chez 16Zips.",
    es: "Conozca nuestra política de envío, incluidos los tiempos de entrega, áreas atendidas, métodos de envío y qué esperar al ordenar cannabis de 16Zips.",
    de: "Erfahren Sie mehr über unsere Versandrichtlinie, einschließlich Lieferzeiten, belieferte Gebiete, Versandmethoden und was Sie bei einer Bestellung bei 16Zips erwarten können.",
  },
  keywords: {
    en: "16Zips shipping policy, cannabis delivery, weed shipping information, THC product delivery, shipping terms, marijuana shipping rules",
    fr: "politique d'expédition 16Zips, livraison de cannabis, informations sur la livraison de weed, conditions d'expédition",
    es: "política de envío 16Zips, entrega de cannabis, información de envío de marihuana",
    de: "16Zips Versandrichtlinie, Cannabis Lieferung, Versandinformationen",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const langParam = searchParams?.lang;
  const lang: Lang = allowedLangs.includes(langParam as Lang)
    ? (langParam as Lang)
    : "en";

  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    keywords: metaTranslations.keywords[lang],
    robots: "index, follow",
  };
}

export default function Page() {
  const lang: Lang = "en"; // Static page: you can make this dynamic if you want to pass lang from context or props

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: "https://www.16zip.com/shipping-policy",
    description: metaTranslations.description[lang],
    publisher: {
      "@type": "Organization",
      name: "16Zips",
      url: "https://www.16zip.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShippingInformation />
    </>
  );
}
