import 'server-only';

import { Metadata } from 'next';

interface BlogPost {
  title: Record<string, string>;       // Now an object keyed by lang
  content: Record<string, string>;     // Same here
  createdAt: string;
  imageUrl?: string;
  metaTitle?: Record<string, string>;  // Also an object keyed by lang
  metaDescription?: Record<string, string>;
  translations?: {
    [lang: string]: {
      title: string;
      content: string;
      metaTitle?: string;
      metaDescription?: string;
    };
  };
}

type Props = {
  params: { slug: string };
  searchParams: { lang?: string };
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const lang = searchParams?.lang || 'en';
  const slug = params.slug;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog?slug=${encodeURIComponent(slug)}&lang=${lang}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return {};

  const data = await res.json();
  const post: BlogPost = data.data;

  if (!post) return {};

  // Select localized metaTitle, falling back to en or the first available string
  const metaTitle =
    (post.metaTitle && (post.metaTitle[lang] || post.metaTitle['en'])) ||
    post.translations?.[lang]?.metaTitle ||
    post.title?.[lang] ||
    post.title?.['en'] ||
    '';

  // Same for metaDescription
  const metaDescription =
    (post.metaDescription && (post.metaDescription[lang] || post.metaDescription['en'])) ||
    post.translations?.[lang]?.metaDescription ||
    post.content?.[lang]?.slice(0, 150) ||
    '';

  const imageUrl = post.imageUrl;
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog/${encodeURIComponent(slug)}`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: fullUrl,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL!),
  };
}

export async function getBlogPost(slug: string, lang: string = 'en') {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blog?slug=${encodeURIComponent(slug)}&lang=${lang}`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Failed to fetch blog post');
  const data = await res.json();
  return data.data?.post || null;

}



