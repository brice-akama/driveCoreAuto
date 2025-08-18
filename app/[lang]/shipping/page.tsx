import fs from "fs";
import path from "path";
import { Metadata } from "next";
import ShippingInformation from "./ShippingInformation";


const metaTranslations = {
  title: {
    en: "Shipping Policy - DriveCore Auto",
    fr: "Politique d'expédition - DriveCore Auto",
    es: "Política de Envío - DriveCore Auto",
    de: "Versandrichtlinie - DriveCore Auto",
  },
  description: {
    en: "Learn about DriveCore Auto's shipping policy, including delivery times, areas served, shipping methods, and how we deliver high-quality engines, swaps, transmissions, and automotive accessories worldwide.",
    fr: "Découvrez la politique d'expédition de DriveCore Auto, y compris les délais de livraison, les zones desservies, les méthodes d'expédition et la façon dont nous livrons des moteurs, des swaps, des transmissions et des accessoires automobiles de haute qualité dans le monde entier.",
    es: "Conozca la política de envío DriveCore Auto, incluidos los tiempos de entrega, las áreas atendidas, los métodos de envío y cómo entregamos motores, swaps, transmisiones y accesorios automotrices de alta calidad en todo el mundo.",
    de: "Erfahren Sie mehr über die Versandrichtlinie von DriveCore Auto, einschließlich Lieferzeiten, belieferte Gebiete, Versandmethoden und wie wir hochwertige Motoren, Swaps, Getriebe und Autozubehör weltweit liefern.",
  },
  keywords: {
    en: "DriveCore Auto shipping policy, engines, engine swaps, transmissions, automotive accessories, car parts delivery, shipping terms",
    fr: "politique d'expédition DriveCore Auto, moteurs, swaps de moteurs, transmissions, accessoires automobiles, livraison de pièces auto, conditions d'expédition",
    es: "política de envío DriveCore Auto, motores, swaps de motores, transmisiones, accesorios automotrices, entrega de repuestos, términos de envío",
    de: "DriveCore Auto Versandrichtlinie, Motoren, Engine Swaps, Getriebe, Autozubehör, Autoteile Lieferung, Versandbedingungen",
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
    "shipping"
  );
  const filePath = path.join(translationsDir, `${lang}.json`);

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load translations for ${lang}:`, err);
    return {};
  }
}

// --------------------------------------
// Main page
// --------------------------------------
interface Props {
  params: { lang: string };
}

export default async function ShippingPage({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/shipping`,
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
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/shipping`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/shipping`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/shipping`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/shipping`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/shipping`} />

      {/* Shipping page with SSR translations */}
      <ShippingInformation
        initialLanguage={lang}
        initialTranslations={initialTranslations}
      />
    </>
  );
}
