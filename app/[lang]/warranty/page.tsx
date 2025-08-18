import fs from "fs";
import path from "path";
import { Metadata } from "next";

import WarrantyPolicyPage from "./WarrantyPage";

const metaTranslations = {
  title: {
    en: "Warranty Policy - DriveCore Auto",
    fr: "Politique de garantie - DriveCore Auto",
    es: "Política de garantía - DriveCore Auto",
    de: "Garantiebedingungen - DriveCore Auto",
  },
  description: {
    en: "Learn about DriveCore Auto's warranty policy for used Japanese engines and transmissions, including coverage, exclusions, and return procedures.",
    fr: "Découvrez la politique de garantie de DriveCore Auto pour les moteurs et transmissions japonais d'occasion, y compris la couverture, les exclusions et les procédures de retour.",
    es: "Conozca la política de garantía de DriveCore Auto para motores y transmisiones japonesas usadas, incluida la cobertura, exclusiones y procedimientos de devolución.",
    de: "Erfahren Sie mehr über die Garantiebedingungen von DriveCore Auto für gebrauchte japanische Motoren und Getriebe, einschließlich Abdeckung, Ausschlüsse und Rückgabeverfahren.",
  },
  keywords: {
    en: "DriveCore Auto warranty policy, used Japanese engines, transmissions, warranty coverage, exclusions",
    fr: "politique de garantie DriveCore Auto, moteurs japonais d'occasion, transmissions, couverture de garantie, exclusions",
    es: "política de garantía DriveCore Auto, motores japoneses usados, transmisiones, cobertura de garantía, exclusiones",
    de: "DriveCore Auto Garantiebedingungen, gebrauchte japanische Motoren, Getriebe, Garantieabdeckung, Ausschlüsse",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

// --------------------------------------
// Metadata generation for SEO
// --------------------------------------
export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    keywords: metaTranslations.keywords[lang],
    robots: "index, follow",
  };
}

// --------------------------------------
// SSR translations loader
// --------------------------------------
async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(
    process.cwd(),
    "public",
    "translations",
    "warranty"
  );
  const filePath = path.join(translationsDir, `${lang}.json`);

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load warranty translations for ${lang}:`, err);
    return {};
  }
}

// --------------------------------------
// Main page
// --------------------------------------
interface Props {
  params: { lang: string };
}

export default async function WarrantyPage({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/warranty`,
    description: metaTranslations.description[lang],
    publisher: {
      "@type": "Organization",
      name: "DriveCore Auto",
      url: baseUrl,
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hreflang links */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/warranty`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/warranty`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/warranty`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/warranty`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/warranty`} />

      {/* Warranty page with SSR translations */}
      <WarrantyPolicyPage
        initialLanguage={lang}
        initialTranslations={initialTranslations}
      />
    </>
  );
}
