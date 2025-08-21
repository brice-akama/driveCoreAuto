import fs from "fs";
import path from "path";
import { Metadata } from "next";
import FAQsPage from "./FaqsPage";



const metaTranslations = {
  title: {
    en: "FAQs - DriveCore Auto",
    fr: "FAQs - DriveCore Auto",
    es: "Preguntas frecuentes - DriveCore Auto",
    de: "Häufig gestellte Fragen - DriveCore Auto",
  },
  description: {
    en: "Find answers to common questions about DriveCore Auto, engine codes, shipping, returns, and support.",
    fr: "Trouvez des réponses aux questions fréquentes sur DriveCore Auto, les codes moteurs, la livraison, les retours et le support.",
    es: "Encuentre respuestas a preguntas comunes sobre DriveCore Auto, códigos de motor, envíos, devoluciones y soporte.",
    de: "Finden Sie Antworten auf häufig gestellte Fragen zu DriveCore Auto, Motorkenncodes, Versand, Rücksendungen und Support.",
  },
  keywords: {
    en: "DriveCore Auto FAQs, engine codes, shipping, returns, customer support",
    fr: "FAQs DriveCore Auto, codes moteur, livraison, retours, support client",
    es: "FAQs DriveCore Auto, códigos de motor, envíos, devoluciones, atención al cliente",
    de: "DriveCore Auto FAQs, Motorkenncodes, Versand, Rücksendungen, Kundensupport",
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
    "faqs"
  );
  const filePath = path.join(translationsDir, `${lang}.json`);

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load FAQs translations for ${lang}:`, err);
    return {};
  }
}

// --------------------------------------
// Main page
// --------------------------------------
interface Props {
  params: { lang: string };
}

export default async function FAQs({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/faqs`,
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
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/support/faqs`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/support/faqs`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/support/faqs`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/support/faqs`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/support/faqs`} />

      {/* FAQs page with SSR translations */}
      <FAQsPage initialLanguage={lang} initialTranslations={initialTranslations} />
    </>
  );
}
