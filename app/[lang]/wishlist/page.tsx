import fs from "fs";
import path from "path";
import { Metadata } from "next";
import WishlistComponent from "./WishlistComponent";
 // move your current client component here

// SEO metadata translations
const metaTranslations = {
  title: {
    en: "Wishlist - DriveCore Auto",
    fr: "Liste de souhaits - DriveCore Auto",
    es: "Lista de deseos - DriveCore Auto",
    de: "Wunschliste - DriveCore Auto",
  },
  description: {
    en: "View your saved favorite products on DriveCore Auto and easily add them to your cart.",
    fr: "Voir vos produits favoris enregistrés sur DriveCore Auto et les ajouter facilement à votre panier.",
    es: "Vea sus productos favoritos guardados en DriveCore Auto y agréguelos fácilmente a su carrito.",
    de: "Sehen Sie sich Ihre gespeicherten Lieblingsprodukte bei DriveCore Auto an und fügen Sie sie einfach Ihrem Warenkorb hinzu.",
  },
  keywords: {
    en: "wishlist, DriveCore Auto, favorite products, saved items, shopping cart",
    fr: "liste de souhaits, DriveCore Auto, produits favoris, articles enregistrés, panier",
    es: "lista de deseos, DriveCore Auto, productos favoritos, artículos guardados, carrito",
    de: "Wunschliste, DriveCore Auto, Lieblingsprodukte, gespeicherte Artikel, Warenkorb",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

// --------------------------------------
// Metadata for SEO
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
    "wishlist"
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

export default async function WishlistPage({ params }: Props) {
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/wishlist`,
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
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/wishlist`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/wishlist`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/wishlist`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/wishlist`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/wishlist`} />

      {/* Wishlist page with SSR translations */}
      <WishlistComponent
        initialLanguage={lang}
        initialTranslations={initialTranslations}
      />
    </>
  );
}


