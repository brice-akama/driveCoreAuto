import fs from "fs";
import path from "path";
import { Metadata } from "next";
import AboutPageComponent from "./AboutPageComponent";

const metaTranslations = {
  title: {
    en: "About Us - DriveCore Auto",
    fr: "À propos de nous - DriveCore Auto",
    es: "Sobre nosotros - DriveCore Auto",
    de: "Über uns - DriveCore Auto"
  },
  description: {
    en: "Learn about DriveCore Auto, our mission, experience, quality assurance, and commitment to delivering premium automotive engines.",
    fr: "Découvrez DriveCore Auto, notre mission, notre expérience, l'assurance qualité et notre engagement à fournir des moteurs automobiles de qualité supérieure.",
    es: "Conozca DriveCore Auto, nuestra misión, experiencia, garantía de calidad y compromiso con la entrega de motores automotrices premium.",
    de: "Erfahren Sie mehr über DriveCore Auto, unsere Mission, Erfahrung, Qualitätssicherung und unser Engagement für hochwertige Automotoren."
  },
  keywords: {
    en: "DriveCore Auto, About Us, mission, quality, automotive engines",
    fr: "DriveCore Auto, À propos, mission, qualité, moteurs automobiles",
    es: "DriveCore Auto, Sobre nosotros, misión, calidad, motores automotrices",
    de: "DriveCore Auto, Über uns, Mission, Qualität, Automotoren"
  }
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";

  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    keywords: metaTranslations.keywords[lang],
    robots: "index, follow"
  };
}

async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(process.cwd(), "public", "translations", "about-us");
  const filePath = path.join(translationsDir, `${lang}.json`);

  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load About Us translations for ${lang}:`, err);
    return {};
  }
}

interface Props {
  params: { lang: string };
}

export default async function About({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";
  const initialTranslations = await loadTranslations(lang);
  const baseUrl = "https://www.drivecoreauto.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/about-us`,
    description: metaTranslations.description[lang],
    publisher: {
      "@type": "Organization",
      name: "DriveCore Auto",
      url: baseUrl
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/about-us`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/about-us`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/about-us`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/about-us`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/about-us`} />

      <AboutPageComponent initialLanguage={lang} initialTranslations={initialTranslations} />
    </>
  );
}
