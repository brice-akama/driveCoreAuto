// Import necessary modules
// app/page.tsx
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

import HeroImage from "./components/HeroImage";
import AboutEnginesSection from "./components/AboutEnginesSection";
import EngineBrandGrid from "./components/EngineBrandGrid";
import DescriptionsHome from "./components/DescriptionsHome";

// Dynamically imported components
const BestSeller = dynamic(() => import("./components/BestSeller"), {
  loading: () => <p>Loading featured products...</p>,
});

const BlogPost = dynamic(() => import("./components/BlogPost"), {
  loading: () => <p>Loading blog posts...</p>,
});

// ----------------------------
// Metadata translations
// ----------------------------
const metaTranslations = {
  title: {
    en: "Home - DriveCore Auto",
    fr: "Accueil - DriveCore Auto",
    es: "Inicio - DriveCore Auto",
    de: "Startseite - DriveCore Auto",
  },
  description: {
    en: "DriveCore Auto is your trusted destination for premium auto parts and accessories. We provide high-quality products, reliable shipping, and a seamless shopping experience.",
    fr: "DriveCore Auto est votre destination de confiance pour des pièces automobiles et accessoires premium.",
    es: "DriveCore Auto es su destino confiable para repuestos y accesorios de automóviles de primera calidad.",
    de: "DriveCore Auto ist Ihr vertrauenswürdiges Ziel für hochwertige Autoersatzteile und Zubehör.",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

// ----------------------------
// Load homePage translations
// ----------------------------
async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(process.cwd(), "public", "translations", "homePage");
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(`❌ Failed to load translations for ${lang}:`, err);
    return {};
  }
}

// ----------------------------
// Load descriptionsHome translations
// ----------------------------
async function loadDescriptionsHomeTranslations(lang: Lang) {
  const translationsDir = path.join(process.cwd(), "public", "translations", "descriptionsHome");
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContents).descriptionsHome || {};
  } catch (err) {
    console.error(`❌ Failed to load descriptionsHome translations for ${lang}:`, err);
    return {};
  }
}

// ----------------------------
// Metadata generation
// ----------------------------
export async function generateMetadata({ searchParams }: { searchParams?: { lang?: string } }): Promise<Metadata> {
  const lang: Lang = allowedLangs.includes(searchParams?.lang as Lang)
    ? (searchParams!.lang as Lang)
    : "en";

  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    robots: "index, follow",
  };
}

// ----------------------------
// HomePage SSR
// ----------------------------
interface Props {
  searchParams?: { lang?: string };
}

export default async function Home({ searchParams }: Props) {
  const lang: Lang = allowedLangs.includes(searchParams?.lang as Lang)
    ? (searchParams!.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);
  const descriptionsHomeTranslations = await loadDescriptionsHomeTranslations(lang);

  return (
    <>
      <HeroImage />

      <AboutEnginesSection
        initialLanguage={lang}
        initialTranslations={initialTranslations}
      />

      <EngineBrandGrid />

      <BestSeller />

      {/* Descriptions Home */}
      <DescriptionsHome
        initialLanguage={lang}
        initialTranslations={descriptionsHomeTranslations}
      />

      <BlogPost />
    </>
  );
}
