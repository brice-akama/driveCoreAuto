export const dynamic = "force-dynamic";


import { fetchProduct } from "./fetchProduct";
import ProductDetailsPage from "./ProductDetailsPage";
import { Metadata } from "next";
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
  searchParams: { lang: string };
};


// ✅ Awaiting async `params` and `searchParams`
export async function generateMetadata(props: Promise<Props>): Promise<Metadata> {
  const { params } = await props;

  const product = await fetchProduct(params.slug, "en");

  if (!product || !product.name) return notFound();

  const ogImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/og?title=${encodeURIComponent(product.name)}`;
  const image = product.mainImage || ogImageUrl;
  const baseUrl = `https://www.16zip.com/products/${product.slug}`;

  return {
    title: product.seoTitle || `${product.name} | 16Zips`,
    description: product.seoDescription || product.description?.slice(0, 160),
    keywords: product.seoKeywords || `${product.name}, fitness, ${product.category || ""}`,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description?.slice(0, 160),
      images: [image],
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description?.slice(0, 160),
      images: [image],
    },
    alternates: {
      canonical: baseUrl, // ✅ Clean canonical without ?lang
    },
  };
}



export const revalidate = 60;


export default async function Page(props: Promise<Props>) {
  const { params, searchParams } = await props;
  
  const product = await fetchProduct(params.slug, searchParams.lang || "en");

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} />;
}