// app/blog/page.tsx
import { Metadata } from 'next';
import BlogPage, { BlogPost as BlogPostType } from './BlogPage';
import { cookies } from 'next/headers';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  // Determine language from cookie or query
  const langCookieStore = await cookies();
  const langCookie = langCookieStore.get('language');
  const currentLang = searchParams?.lang || langCookie?.value || 'en';

  // Fetch blog posts from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?lang=${currentLang}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const posts: BlogPostType[] = Array.isArray(data.data) ? data.data : [];

  const seoPost = posts[0]; // Use first post for metadata
  const title = seoPost?.title?.[currentLang] || 'Blog - 16Zips';
  const description =
    seoPost?.content?.[currentLang]?.slice(0, 150) || 'Explore cannabis insights, product highlights, usage tips, and industry news on the 16Zips blog.';
  const image = seoPost?.imageUrl || '/default-blog-image.jpg';
  const pageUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog`;

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": title,
    "url": pageUrl,
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": "16Zips",
      "url": process.env.NEXT_PUBLIC_API_URL,
    },
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
    alternates: { canonical: pageUrl },
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL!),
    icons: { icon: '/favicon.ico' },
    other: { 'application/ld+json': JSON.stringify(jsonLd) },
  };
}

export default async function Page({ searchParams }: { searchParams?: { lang?: string } }) {
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
