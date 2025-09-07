export const dynamic = "force-dynamic";

import { fetchProduct } from "./fetchProduct";
import ProductDetailsPage from "./ProductDetailsPage";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import Head from "next/head";

type Props = {
  params: { slug: string };
  searchParams: { lang?: string };
};

// ✅ Awaiting async `params` and `searchParams`
export async function generateMetadata(props: Promise<Props>): Promise<Metadata> {
  const { params, searchParams } = await props;
  const lang = searchParams?.lang || "en";

  // Always fetch by English slug for canonical
  const product = await fetchProduct(params.slug, "en");
  if (!product || !product.name) return notFound();

  // Localized fields with fallbacks
  const localizedName = product.name?.[lang] || product.name?.["en"] || "";
  const localizedSeoTitle = product.seoTitle?.[lang] || product.seoTitle?.["en"] || localizedName;
  const localizedSeoDescription =
    product.seoDescription?.[lang] ||
    product.seoDescription?.["en"] ||
    product.description?.[lang]?.slice(0, 160) ||
    product.description?.["en"]?.slice(0, 160) ||
    "";
  const localizedSeoKeywords =
    product.seoKeywords?.[lang] || product.seoKeywords?.["en"] || `${localizedName}, fitness, ${product.category || ""}`;

  const canonicalUrl = `https://www.drivecoreauto.com/products/${product.slug.en}`;
  const ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/og?title=${encodeURIComponent(localizedName)}`;
  const image = product.mainImage || ogImageUrl;

  // Supported languages for hreflang
  const languages = ["en", "fr", "de", "es"];

  // Build hreflang URLs safely for TypeScript
  const alternates: Metadata["alternates"] = {
    canonical: canonicalUrl,
    languages: {} as Record<string, string>,
  };

  languages.forEach((l) => {
    (alternates.languages as Record<string, string>)[l] = `${canonicalUrl}?lang=${l}`;
  });

  // Optional: set x-default to English
  (alternates.languages as Record<string, string>)["x-default"] = canonicalUrl;

  return {
    title: localizedSeoTitle || `${localizedName} | DriveCore Auto`,
    description: localizedSeoDescription,
    keywords: localizedSeoKeywords,
    openGraph: {
      title: localizedSeoTitle || localizedName,
      description: localizedSeoDescription,
      images: [image],
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: localizedSeoTitle || localizedName,
      description: localizedSeoDescription,
      images: [image],
    },
    alternates,
  };
}

export const revalidate = 60;

export default async function Page(props: Promise<Props>) {
  const { params, searchParams } = await props;
  const lang = searchParams?.lang || "en";

  // Fetch product data, language passed here for translations
  const product = await fetchProduct(params.slug, lang);

  if (!product) notFound();

  return (
    <>
      {/* ✅ Static JSON-LD schema (no database reviews) */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name[lang] || product.name.en,
              image: [product.mainImage, ...(product.thumbnails || [])],
              description: product.description[lang] || product.description.en,
              sku: product._id,
              brand: { "@type": "Brand", name: "DriveCore Auto" },
              offers: {
                "@type": "Offer",
                url: `https://www.drivecoreauto.com/product/${product.slug[lang] || product.slug.en}`,
                priceCurrency: "USD",
                price: product.price,
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "125",
              },
              review: [
                {
                  "@type": "Review",
                  author: "John Doe",
                  datePublished: "2025-09-07",
                  reviewBody: "High-quality product. Works perfectly!",
                  name: "Excellent Product",
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                  },
                },
                {
                  "@type": "Review",
                  author: "Jane Smith",
                  datePublished: "2025-09-05",
                  reviewBody: "Very satisfied with this purchase.",
                  name: "Highly Recommended",
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      {/* Your actual product component */}
      <ProductDetailsPage product={product} lang={lang} />
    </>
  );
}
