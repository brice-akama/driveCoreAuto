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

  // Frontend page URL
  const pageUrl = 'https://www.drivecoreauto.com/blog';

  // Fetch blog posts from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?lang=${currentLang}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const posts: BlogPostType[] = Array.isArray(data.data) ? data.data : [];

  const seoPost = posts[0]; // Use first post for metadata
  const title = seoPost?.title?.[currentLang] || 'Blog - DriveCore Auto';
  const description =
    seoPost?.content?.[currentLang]?.slice(0, 150) ||
    'Discover automotive insights, product highlights, maintenance tips, and industry news on the DriveCore Auto blog.';
  const image = seoPost?.imageUrl || '/assets/hero.png';

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": title,
    "url": pageUrl,
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": "DriveCore Auto",
      "url": "https://www.drivecoreauto.com",
    },
  };

  // Multi-language alternates
 const supportedLanguages = ['en', 'fr', 'de', 'es'];

// Build languages object safely
const languages: Record<string, string> = {};
supportedLanguages.forEach((lang) => {
  languages[lang] = `${pageUrl}?lang=${lang}`;
});
languages['x-default'] = pageUrl;

// Assign alternates
const alternates: Metadata['alternates'] = {
  canonical: pageUrl,
  languages, // safe, fully typed
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

  // Fetch blog posts for rendering
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?lang=${currentLang}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const posts: BlogPostType[] = Array.isArray(data.data) ? data.data : [];

  return <BlogPage initialPosts={posts} />;
}
