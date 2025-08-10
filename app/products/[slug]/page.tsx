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

  // Always fetch by English slug to keep canonical URLs consistent
  const product = await fetchProduct(params.slug, "en");

  if (!product || !product.name) return notFound();

  // Get localized SEO and name fields with fallbacks
  const localizedName = (product.name && (product.name[lang] || product.name["en"])) || "";
  const localizedSeoTitle = (product.seoTitle && (product.seoTitle[lang] || product.seoTitle["en"])) || localizedName;
  const localizedSeoDescription = (product.seoDescription && (product.seoDescription[lang] || product.seoDescription["en"])) || (product.description?.[lang] || product.description?.["en"])?.slice(0, 160) || "";
  const localizedSeoKeywords = (product.seoKeywords && (product.seoKeywords[lang] || product.seoKeywords["en"])) || `${localizedName}, fitness, ${product.category || ""}`;

  // URL always points to English slug for canonical purposes
  const baseUrl = `https://www.16zip.com/products/${product.slug}`;

  // Use mainImage or fallback OG image URL
  const ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/og?title=${encodeURIComponent(localizedName)}`;
  const image = product.mainImage || ogImageUrl;

  return {
    title: localizedSeoTitle || `${localizedName} | 16Zips`,
    description: localizedSeoDescription,
    keywords: localizedSeoKeywords,
    openGraph: {
      title: localizedSeoTitle || localizedName,
      description: localizedSeoDescription,
      images: [image],
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: localizedSeoTitle || localizedName,
      description: localizedSeoDescription,
      images: [image],
    },
    alternates: {
      canonical: baseUrl, // Clean canonical URL without lang param for SEO
    },
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

  return <ProductDetailsPage product={product} />;
}
