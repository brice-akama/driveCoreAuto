import fs from "fs";
import path from "path";
import { Metadata } from "next";
import CookiePolicyPage from "./CookiePolicyPage";

type Lang = "en" | "fr" | "de" | "es";
const allowedLangs: Lang[] = ["en", "fr", "de", "es"];

const metaTranslations = {
  title: {
    en: "Cookie Policy | DriveCore Auto",
    fr: "Politique de cookies | DriveCore Auto",
    de: "Cookie-Richtlinie | DriveCore Auto",
    es: "Política de cookies | DriveCore Auto",
  },
  description: {
    en: "Learn how DriveCore Auto uses cookies to improve your browsing experience and protect your data.",
    fr: "Découvrez comment DriveCore Auto utilise les cookies pour améliorer votre navigation et protéger vos données.",
    de: "Erfahren Sie, wie DriveCore Auto Cookies verwendet, um Ihr Surferlebnis zu verbessern und Ihre Daten zu schützen.",
    es: "Aprenda cómo DriveCore Auto utiliza cookies para mejorar su experiencia de navegación y proteger sus datos.",
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
  const translationsDir = path.join(process.cwd(), "public", "translations", "cookie-policy");
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load Cookie Policy translations for ${lang}:`, err);
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

  return <CookiePolicyPage initialLanguage={lang} initialTranslations={initialTranslations} />;
}
