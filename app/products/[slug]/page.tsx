export const dynamic = "force-dynamic";

import { fetchProduct } from "./fetchProduct";
import ProductDetailsPage from "./ProductDetailsPage";
import { Metadata } from "next";
import { notFound } from 'next/navigation';

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

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} lang={lang} />

}
