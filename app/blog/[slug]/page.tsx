import { getBlogPost } from './fetchBlog';
import BlogDetails from './BlogDetails';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
  searchParams?: { lang?: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = searchParams?.lang || 'en';

  // Fetch by English slug + lang (already your slug param)
  const post = await getBlogPost(params.slug, lang);

  if (!post) return {};

  const metaTitle =
    (post.metaTitle && (post.metaTitle[lang] || post.metaTitle['en'])) ||
    post.title?.[lang] ||
    post.title?.['en'] ||
    '';

  const metaDescription =
    (post.metaDescription && (post.metaDescription[lang] || post.metaDescription['en'])) ||
    (post.content && (post.content[lang]?.slice(0, 150) || post.content['en']?.slice(0, 150))) ||
    '';

  const imageUrl = post.imageUrl;

  // Always build canonical URL with English slug (params.slug is English slug)
  const canonicalUrl = `https://www.16zip.com/blog/${params.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL!),
  };
}

export default async function Page({ params, searchParams }: Props) {
  const lang = searchParams?.lang || 'en';

  // Fetch post with English slug + lang param
  const post = await getBlogPost(params.slug, lang);

  if (!post) return <div>Post not found</div>;

  return <BlogDetails post={post} />;
}
