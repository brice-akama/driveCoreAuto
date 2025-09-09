// app/blog/page.tsx
// app/blog/page.tsx
import { Metadata } from 'next';
import BlogPage, { BlogPost as BlogPostType } from './BlogPage';
import { cookies } from 'next/headers';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  // Determine language from query or cookie
  const langCookieStore = await cookies();
  const langCookie = langCookieStore.get('language');
  const currentLang = searchParams?.lang || langCookie?.value || 'en';

  // ✅ CHANGE 1: Canonical always points to English version (same as products)
  const canonicalUrl = 'https://www.drivecoreauto.com/blog?lang=en';

  // Fetch blog posts from API - always fetch English for consistent metadata
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?lang=en`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const posts: BlogPostType[] = Array.isArray(data.data) ? data.data : [];

  // Get localized content if available
  const seoPost = posts[0]; // Use first post for metadata
  const title = seoPost?.title?.[currentLang] || seoPost?.title?.['en'] || 'Blog - DriveCore Auto';
  const description =
    seoPost?.content?.[currentLang]?.slice(0, 150) ||
    seoPost?.content?.['en']?.slice(0, 150) ||
    'Discover automotive insights, product highlights, maintenance tips, and industry news on the DriveCore Auto blog.';
  const image = seoPost?.imageUrl || '/assets/hero.png';

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": title,
    "url": canonicalUrl, // ✅ CHANGE 2: Use canonical URL in JSON-LD
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": "DriveCore Auto",
      "url": "https://www.drivecoreauto.com",
    },
  };

  // ✅ CHANGE 3: Build hreflang URLs properly (same pattern as products)
  const supportedLanguages = ['en', 'fr', 'de', 'es'];

  const languages: Record<string, string> = {};
  supportedLanguages.forEach((lang) => {
    languages[lang] = `https://www.drivecoreauto.com/blog?lang=${lang}`;
  });
  languages['x-default'] = canonicalUrl;

  // ✅ CHANGE 4: Use canonical URL consistently
  const alternates: Metadata['alternates'] = {
    canonical: canonicalUrl, // Always English
    languages,
  };

  return {
    title: `${title} | DriveCore Auto`,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl, // ✅ CHANGE 5: OG URL uses canonical
      images: [{ url: image, width: 800, height: 600 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates,
    metadataBase: new URL('https://www.drivecoreauto.com'),
    icons: { icon: '/favicon.ico' },
    other: { 'application/ld+json': JSON.stringify(jsonLd) },
  };
}

export default async function Page({ searchParams }: { searchParams?: { lang?: string } }) {
  // Determine language
  const langCookieStore = await cookies();
  const langCookie = langCookieStore.get('language');
  const currentLang = searchParams?.lang || langCookie?.value || 'en';

  // Fetch blog posts for rendering - this can be in current language
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?lang=${currentLang}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const posts: BlogPostType[] = Array.isArray(data.data) ? data.data : [];

  return <BlogPage initialPosts={posts} />;
}