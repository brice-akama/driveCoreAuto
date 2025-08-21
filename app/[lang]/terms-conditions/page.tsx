import fs from "fs";
import path from "path";
import { Metadata } from "next";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

type Lang = "en" | "fr" | "de" | "es";
const allowedLangs: Lang[] = ["en", "fr", "de", "es"];

const metaTranslations = {
  title: {
    en: "Terms and Conditions | DriveCore Auto",
    fr: "Conditions générales | DriveCore Auto",
    de: "Allgemeine Geschäftsbedingungen | DriveCore Auto",
    es: "Términos y Condiciones | DriveCore Auto",
  },
  description: {
    en: "Read the detailed Terms and Conditions for DriveCore Auto, covering orders, shipping, warranties, and more.",
    fr: "Lisez les Conditions générales détaillées de DriveCore Auto, couvrant les commandes, la livraison, les garanties et plus encore.",
    de: "Lesen Sie die detaillierten Allgemeinen Geschäftsbedingungen von DriveCore Auto, einschließlich Bestellungen, Versand, Garantien und mehr.",
    es: "Lea los Términos y Condiciones detallados de DriveCore Auto, que cubren pedidos, envíos, garantías y más.",
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
    robots: "index, follow",
  };
}

// --------------------------------------
// SSR translations loader
// --------------------------------------
async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(process.cwd(), "public", "translations", "terms-conditions");
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load Terms and Conditions translations for ${lang}:`, err);
    return {};
  }
}

// --------------------------------------
// Main page
// --------------------------------------
interface Props {
  params: { lang: string };
}

export default async function Page({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";
  const initialTranslations = await loadTranslations(lang);

  return <TermsAndConditionsPage initialLanguage={lang} initialTranslations={initialTranslations} />;
}
