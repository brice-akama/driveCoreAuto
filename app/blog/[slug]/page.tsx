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
  const post = await getBlogPost(params.slug, lang);

  if (!post) return {};

  // Safe access for metaTitle and metaDescription
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

export const revalidate = 60;

export default async function Page({ params, searchParams }: Props) {
  const lang = searchParams?.lang || 'en';
  const post = await getBlogPost(params.slug, lang);

  if (!post) return <div>Post not found</div>;

  return <BlogDetails post={post} />;
}
