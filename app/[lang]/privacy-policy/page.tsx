// app/privacy-policy/page.tsx
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

const metaTranslations = {
  title: {
    en: "Privacy Policy - DriveCore Auto",
    fr: "Politique de confidentialité - DriveCore Auto",
    es: "Política de privacidad - DriveCore Auto",
    de: "Datenschutzrichtlinie - DriveCore Auto"
  },
  description: {
    en: "Learn how DriveCore Auto collects, uses, and safeguards your personal information.",
    fr: "Découvrez comment DriveCore Auto collecte, utilise et protège vos informations personnelles.",
    es: "Aprenda cómo DriveCore Auto recopila, utiliza y protege su información personal.",
    de: "Erfahren Sie, wie DriveCore Auto Ihre persönlichen Daten sammelt, verwendet und schützt."
  }
};

async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(process.cwd(), "public", "translations", "privacy-policy");
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load Privacy Policy translations for ${lang}:`, err);
    return {};
  }
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";
  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    robots: "index, follow"
  };
}

interface Props {
  params: { lang: string };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang) ? (params.lang as Lang) : "en";
  const initialTranslations = await loadTranslations(lang);

  return <PrivacyPolicyContent initialTranslations={initialTranslations} />;
}
