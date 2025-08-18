// Import necessary modules
// app/page.tsx
// app/page.tsx
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

import HeroImage from "./components/HeroImage";
import AboutEnginesSection from "./components/AboutEnginesSection";
import EngineBrandGrid from "./components/EngineBrandGrid";

// Dynamically imported components
const BestSeller = dynamic(() => import("./components/BestSeller"), {
  loading: () => <p>Loading featured products...</p>,
});

const BlogPost = dynamic(() => import("./components/BlogPost"), {
  loading: () => <p>Loading featured products...</p>,
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
    en: "DriveCore Auto is your trusted destination for premium auto parts and accessories. We provide high-quality products, reliable shipping, and a seamless shopping experience to keep your vehicle running at its best.",
    fr: "DriveCore Auto est votre destination de confiance pour des pièces automobiles et accessoires premium. Nous fournissons des produits de haute qualité, une livraison fiable et une expérience d'achat fluide.",
    es: "DriveCore Auto es su destino confiable para repuestos y accesorios de automóviles de primera calidad. Ofrecemos productos de alta calidad, envío confiable y una experiencia de compra perfecta.",
    de: "DriveCore Auto ist Ihr vertrauenswürdiges Ziel für hochwertige Autoersatzteile und Zubehör. Wir bieten qualitativ hochwertige Produkte, zuverlässigen Versand und ein nahtloses Einkaufserlebnis.",
  },
  keywords: {
    en: "DriveCore Auto, auto parts, car accessories, vehicle maintenance, automotive store, car care, performance parts, online auto shop, quality car parts, affordable auto accessories",
    fr: "DriveCore Auto, pièces auto, accessoires auto, entretien véhicule, boutique automobile, soins de voiture, pièces performance, boutique en ligne, pièces auto de qualité, accessoires auto abordables",
    es: "DriveCore Auto, repuestos de autos, accesorios de autos, mantenimiento de vehículos, tienda automotriz, cuidado del auto, piezas de rendimiento, tienda online, piezas de calidad, accesorios asequibles",
    de: "DriveCore Auto, Autoteile, Autozubehör, Fahrzeugwartung, Autogeschäft, Autopflege, Leistungsersatzteile, Online-Autoladen, hochwertige Autoteile, erschwingliches Autozubehör",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

// ----------------------------
// Load translations for HomePage
// ----------------------------
async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(
    process.cwd(),
    "public",
    "translations",
    "homePage"
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

// ----------------------------
// Metadata generation
// ----------------------------
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const lang: Lang = allowedLangs.includes(searchParams?.lang as Lang)
    ? (searchParams!.lang as Lang)
    : "en";

  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    keywords: metaTranslations.keywords[lang],
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

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/?lang=${lang}`,
    description: metaTranslations.description[lang],
    publisher: {
      "@type": "Organization",
      name: "DriveCore Auto",
      url: baseUrl,
    },
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hreflang links */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/?lang=en`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/?lang=fr`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/?lang=es`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/?lang=de`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/?lang=en`} />

      {/* Main page content */}
      <HeroImage />
      <AboutEnginesSection initialLanguage={lang} initialTranslations={initialTranslations} />
      <EngineBrandGrid />
      <BestSeller />
      <BlogPost />
    </>
  );
}
