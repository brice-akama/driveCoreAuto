import fs from "fs";
import path from "path";
import { Metadata } from "next";
import BuyerServicesPage from "./BuyerServices";

const metaTranslations = {
  title: {
    en: "Buyer Services - DriveCore Auto",
    fr: "Services aux acheteurs - DriveCore Auto",
    es: "Servicios para compradores - DriveCore Auto",
    de: "Käuferservices - DriveCore Auto",
  },
  description: {
    en: "Learn about DriveCore Auto's buyer support services, including product consultation, compatibility checks, installation guidance, order tracking, returns, and custom orders.",
    fr: "Découvrez les services aux acheteurs de DriveCore Auto, y compris la consultation produit, la vérification de compatibilité, les conseils d'installation, le suivi des commandes, les retours et les commandes personnalisées.",
    es: "Conozca los servicios para compradores de DriveCore Auto, incluyendo consulta de producto, verificación de compatibilidad, guía de instalación, seguimiento de pedidos, devoluciones y pedidos personalizados.",
    de: "Erfahren Sie mehr über die Käuferservices von DriveCore Auto, einschließlich Produktberatung, Kompatibilitätsprüfung, Installationshinweise, Bestellverfolgung, Rückgaben und Sonderbestellungen.",
  },
  keywords: {
    en: "DriveCore Auto buyer services, product consultation, compatibility, installation, order tracking, returns, custom orders",
    fr: "services aux acheteurs DriveCore Auto, consultation produit, compatibilité, installation, suivi des commandes, retours, commandes personnalisées",
    es: "servicios para compradores DriveCore Auto, consulta de producto, compatibilidad, instalación, seguimiento de pedidos, devoluciones, pedidos personalizados",
    de: "DriveCore Auto Käuferservices, Produktberatung, Kompatibilität, Installation, Bestellverfolgung, Rückgaben, Sonderbestellungen",
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
    "buyer-services"
  );
  const filePath = path.join(translationsDir, `${lang}.json`);

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load Buyer Services translations for ${lang}:`, err);
    return {};
  }
}

// --------------------------------------
// Main page
// --------------------------------------
interface Props {
  params: { lang: string };
}

export default async function BuyerServices({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/support/buyer-services`,
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
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/support/buyer-services`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/support/buyer-services`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/support/buyer-services`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/support/buyer-services`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/support/buyer-services`} />

      {/* Buyer Services page with SSR translations */}
      <BuyerServicesPage
        initialLanguage={lang}
        initialTranslations={initialTranslations}
      />
    </>
  );
}
