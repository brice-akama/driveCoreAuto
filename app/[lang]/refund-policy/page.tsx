// app/refund-policy/page.tsx
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import RefundPolicyPageContent from "./RefundPolicyPageContent"; // We'll separate JSX for clarity

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

// --------------------------------------
// Metadata translations
// --------------------------------------
const metaTranslations = {
  title: {
    en: "Refund Policy - DriveCore Auto",
    fr: "Politique de remboursement - DriveCore Auto",
    es: "Política de reembolso - DriveCore Auto",
    de: "Rückerstattungsrichtlinie - DriveCore Auto",
  },
  description: {
    en: "Learn about DriveCore Auto's refund policy for engine parts, returns, and shipping.",
    fr: "Découvrez la politique de remboursement de DriveCore Auto pour les pièces de moteur, les retours et l'expédition.",
    es: "Conozca la política de reembolso de DriveCore Auto para piezas de motor, devoluciones y envíos.",
    de: "Erfahren Sie mehr über die Rückerstattungsrichtlinie von DriveCore Auto für Motorteile, Rücksendungen und Versand.",
  },
  keywords: {
    en: "DriveCore Auto, refund policy, returns, engine parts",
    fr: "DriveCore Auto, politique de remboursement, retours, pièces de moteur",
    es: "DriveCore Auto, política de reembolso, devoluciones, piezas de motor",
    de: "DriveCore Auto, Rückerstattungsrichtlinie, Rücksendungen, Motorteile",
  },
};

// --------------------------------------
// Metadata generation for SEO
// --------------------------------------
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";
  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    keywords: metaTranslations.keywords[lang],
    robots: "index, follow",
  };
}

// --------------------------------------
// Load translations
// --------------------------------------
async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(process.cwd(), "public", "translations", "refund-policy");
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load Refund Policy translations for ${lang}:`, err);
    return {};
  }
}

// --------------------------------------
// Main page component
// --------------------------------------
interface Props {
  params: { lang: string };
}

export default async function RefundPolicy({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";
  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/refund-policy`,
    description: metaTranslations.description[lang],
    publisher: {
      "@type": "Organization",
      name: "DriveCore Auto",
      url: baseUrl,
    },
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hreflang links */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/refund-policy`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/refund-policy`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/refund-policy`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/refund-policy`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/refund-policy`} />

      {/* Render the page content with translations */}
      <RefundPolicyPageContent initialTranslations={initialTranslations} />
    </>
  );
}
