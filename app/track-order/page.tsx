// app/track-order/page.tsx
// app/track-order/page.tsx
import { Metadata } from "next";
import React from "react";
import TrackOrderPage from "./TrackOrderPage";

const metaTranslations = {
  title: {
    en: "Track Order - DriveCore Auto",
    fr: "Suivi de Commande - DriveCore Auto",
    es: "Rastreo de Pedido - DriveCore Auto",
    de: "Bestellung verfolgen - DriveCore Auto",
  },
  description: {
    en: "Track your DriveCore Auto orders, including engines, swaps, transmissions, automotive accessories, and more. Enter your Order ID and Billing Email to view order status, shipping updates, and delivery details.",
    fr: "Suivez vos commandes DriveCore Auto, y compris les moteurs, swaps, transmissions, accessoires automobiles et plus. Entrez votre ID de commande et votre email de facturation pour voir le statut de la commande, les mises à jour d'expédition et les détails de livraison.",
    es: "Rastree sus pedidos de DriveCore Auto, incluidos motores, swaps, transmisiones, accesorios automotrices y más. Ingrese su ID de pedido y correo electrónico de facturación para ver el estado del pedido, actualizaciones de envío y detalles de entrega.",
    de: "Verfolgen Sie Ihre DriveCore Auto-Bestellungen, einschließlich Motoren, Swaps, Getriebe, Autozubehör und mehr. Geben Sie Ihre Bestellnummer und Rechnungs-E-Mail ein, um den Bestellstatus, Versandupdates und Lieferdetails zu sehen.",
  },
  keywords: {
    en: "DriveCore Auto track order, order tracking, engines, engine swaps, transmissions, automotive accessories, order status, shipping updates",
    fr: "DriveCore Auto suivi de commande, suivi de commande, moteurs, swaps de moteurs, transmissions, accessoires automobiles, statut de commande, mises à jour d'expédition",
    es: "DriveCore Auto rastreo de pedido, seguimiento de pedidos, motores, swaps de motores, transmisiones, accesorios automotrices, estado del pedido, actualizaciones de envío",
    de: "DriveCore Auto Bestellung verfolgen, Bestellverfolgung, Motoren, Engine Swaps, Getriebe, Autozubehör, Bestellstatus, Versandupdates",
  },
};

type Lang = "en" | "fr" | "es" | "de";
const allowedLangs: Lang[] = ["en", "fr", "es", "de"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const langParam = searchParams?.lang;
  const lang: Lang = allowedLangs.includes(langParam as Lang)
    ? (langParam as Lang)
    : "en";

  return {
    title: metaTranslations.title[lang],
    description: metaTranslations.description[lang],
    keywords: metaTranslations.keywords[lang],
    robots: "index, follow",
  };
}

export default function Page({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const langParam = searchParams?.lang;
  const lang: Lang = allowedLangs.includes(langParam as Lang)
    ? (langParam as Lang)
    : "en";

  const baseUrl = "https://www.drivecoreauto.com";

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metaTranslations.title[lang],
    url: `${baseUrl}/track-order?lang=${lang}`,
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

      {/* Hreflang links using query parameters */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/track-order?lang=en`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/track-order?lang=fr`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/track-order?lang=es`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/track-order?lang=de`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/track-order?lang=en`} />

      {/* Main component */}
      <TrackOrderPage />
    </>
  );
}
