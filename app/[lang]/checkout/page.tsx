// app/[lang]/checkout/page.tsx
// app/[lang]/checkout/page.tsx
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import CheckOutPage from "./CheckOutPage";

const metaTranslations = {
  title: {
    en: "Checkout - DriveCore Auto",
    fr: "Paiement - DriveCore Auto",
    es: "Pago - DriveCore Auto",
    de: "Kasse - DriveCore Auto",
  },
  description: {
    en: "Complete your DriveCore Auto order by entering your billing and shipping details. Review your order and select your preferred payment method.",
    fr: "Complétez votre commande DriveCore Auto en entrant vos informations de facturation et de livraison. Vérifiez votre commande et sélectionnez votre mode de paiement.",
    es: "Complete su pedido de DriveCore Auto ingresando sus datos de facturación y envío. Revise su pedido y seleccione su método de pago.",
    de: "Schließen Sie Ihre DriveCore Auto-Bestellung ab, indem Sie Ihre Rechnungs- und Lieferinformationen eingeben. Überprüfen Sie Ihre Bestellung und wählen Sie Ihre bevorzugte Zahlungsmethode.",
  },
  keywords: {
    en: "DriveCore Auto checkout, billing details, shipping information, order review, payment methods",
    fr: "DriveCore Auto paiement, détails de facturation, informations de livraison, révision de commande, méthodes de paiement",
    es: "DriveCore Auto pago, detalles de facturación, información de envío, revisión de pedido, métodos de pago",
    de: "DriveCore Auto Kasse, Rechnungsdetails, Lieferinformationen, Bestellübersicht, Zahlungsmethoden",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

// Metadata generation
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

// Load translations
async function loadTranslations(lang: Lang) {
  const translationsDir = path.join(
    process.cwd(),
    "public",
    "translations",
    "checkout"
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

// Main page
interface Props {
  params: { lang: string };
}

export default async function CheckoutPage({ params }: Props) {
  // ✅ Resolve lang in server component
  const lang: Lang = allowedLangs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "en";

  const initialTranslations = await loadTranslations(lang);

  const baseUrl = "https://www.drivecoreauto.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/${lang}/checkout`,
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
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/checkout`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/checkout`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/checkout`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/de/checkout`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/checkout`} />

      {/* ✅ Pass only resolved values to client component */}
      <CheckOutPage
        initialLanguage={lang}
        initialTranslations={initialTranslations}
      />
    </>
  );
}
