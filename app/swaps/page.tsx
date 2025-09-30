
import SwapsPage, { Product as SwapsProduct } from './SwapsPage';
import { cookies } from 'next/headers';
import { Metadata } from 'next';


export async function generateMetadata({ searchParams }: { searchParams?: { category?: string; vehicleModel?: string } }): Promise<Metadata> {
  const categorySlug = searchParams?.category || '';
  const vehicleModel = searchParams?.vehicleModel || '';
  const engineCodeForApi = categorySlug ? categorySlug.toUpperCase() : '';

  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?bumpers=true`;
  if (vehicleModel) apiUrl += `&vehicleModel=${encodeURIComponent(vehicleModel)}`;
  if (engineCodeForApi) apiUrl += `&engineCode=${encodeURIComponent(engineCodeForApi)}`;

  const res = await fetch(apiUrl, { cache: 'no-store' });
  const data = await res.json();

  const products: SwapsProduct[] = (Array.isArray(data.data) ? data.data : []).map((p: any) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    mainImage: p.mainImage,
    category: p.category,
    description: p.description || {},
    Specifications: p.Specifications || {},
    Shipping: p.Shipping || {},
    Warranty: p.Warranty || {},
    thumbnails: p.thumbnails || [],
    metaTitle: p.metaTitle || {},
    metaDescription: p.metaDescription || {},
    imageUrl: p.imageUrl || '',
  }));

  const seoProduct = products[0];
  const cookieStore = await cookies();
const langCookie = cookieStore.get('language');

  const currentLang = langCookie?.value || 'en';

  const title = seoProduct?.metaTitle?.[currentLang] || seoProduct?.name?.[currentLang] || 'Honda Products';
  const description = seoProduct?.metaDescription?.[currentLang] || seoProduct?.description?.[currentLang] || 'Explore Honda engines, transmissions, swaps and more.';
  const image = seoProduct?.imageUrl || '/assets/hero.png';
  const pageUrl = `${process.env.NEXT_PUBLIC_API_URL}/swaps${categorySlug ? `?category=${categorySlug}` : ''}`;

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": seoProduct?.name?.[currentLang] || "Swaps Product",
    "image": [image],
    "description": seoProduct?.description?.[currentLang] || description,
    "sku": seoProduct?._id || "",
    "offers": {
      "@type": "Offer",
      "url": pageUrl,
      "priceCurrency": "USD",
      "price": seoProduct?.price || 0,
      "availability": "https://schema.org/InStock"
    }
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [{ url: image, width: 800, height: 600 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    // Add JSON-LD structured data for Google
    alternates: { canonical: pageUrl },
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL!),
    icons: { icon: '/favicon.ico' },
    other: { 'application/ld+json': JSON.stringify(jsonLd) },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { category?: string; vehicleModel?: string };
}) {
  // Read from URL
  const categorySlug = searchParams?.category || '';      // e.g. "1zz-fe"
  const vehicleModel = searchParams?.vehicleModel || '';

  // Convert to DB/API format (uppercase with dash)
  const engineCodeForApi = categorySlug
    ? categorySlug.toUpperCase()
    : '';

  // Build API URL
  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?bumpers=true`;
  if (vehicleModel) {
    apiUrl += `&vehicleModel=${encodeURIComponent(vehicleModel)}`;
  }
  if (engineCodeForApi) {
    apiUrl += `&engineCode=${encodeURIComponent(engineCodeForApi)}`;
  }

  // Always fetch fresh
  const res = await fetch(apiUrl, { cache: 'no-store' });
  const data = await res.json();

  // Map the fetched data to match ToyotaPage.Product type
  const products: SwapsProduct[] = (Array.isArray(data.data) ? data.data : []).map((p: any) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    mainImage: p.mainImage,
    category: p.category,
    description: p.description || {},
    Specifications: p.Specifications || {},
    Shipping: p.Shipping || {},
    Warranty: p.Warranty || {},
    thumbnails: p.thumbnails || [],
  }));

  const uniqueCategories: string[] = Array.from(new Set(products.map(p => p.category))).sort();

  const modelsSet = new Set<string>();
  products.forEach((p) => {
    const name = p.name['en'] || '';
    const match = name.match(/Honda\s+(\w+)/i);
    if (match && match[1]) modelsSet.add(match[1]);
  });
  const vehicleModels: string[] = Array.from(modelsSet).sort();

  return (
    <SwapsPage
      initialProducts={products}
      initialCategories={uniqueCategories}
      initialVehicleModels={vehicleModels}
      categorySlug={categorySlug} // still pass the lowercase slug for UI
    />
  );
}
