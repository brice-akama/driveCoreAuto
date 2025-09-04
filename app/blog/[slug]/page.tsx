import { getBlogPost } from './fetchBlog';
import BlogDetails from './BlogDetails';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
  searchParams?: { lang?: string };
};

export const dynamic = "force-dynamic";


// Remove HTML tags and trim to desired length
export function getPlainTextSnippet(html: string, maxLength = 150) {
  if (!html) return "";
  // Remove HTML tags
  const plainText = html.replace(/<[^>]*>/g, "");
  // Trim to maxLength without cutting words in half
  if (plainText.length <= maxLength) return plainText;
  const truncated = plainText.slice(0, maxLength);
  return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
}


export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = searchParams?.lang || 'en';

  // Always fetch by English slug for canonical
  const post = await getBlogPost(params.slug, 'en');
  if (!post) return {};

  const localizedTitle =
    (post.metaTitle && (post.metaTitle[lang] || post.metaTitle['en'])) ||
    post.title?.[lang] ||
    post.title?.['en'] ||
    '';

  const localizedDescription =
    (post.metaDescription && (post.metaDescription[lang] || post.metaDescription['en'])) ||
    (post.content && (post.content[lang]?.slice(0, 150) || post.content['en']?.slice(0, 150))) ||
    '';

  const imageUrl = post.imageUrl;

  // Canonical always points to English slug
  const canonicalUrl = `https://www.drivecoreauto.com/blog/${params.slug}`;

  // Supported languages
  const languages = ['en', 'fr', 'de', 'es'];

  // Build hreflang URLs safely for TypeScript
  const alternates: Metadata['alternates'] = {
    canonical: canonicalUrl,
    languages: {} as Record<string, string>,
  };
  languages.forEach((l) => {
    (alternates.languages as Record<string, string>)[l] = `${canonicalUrl}?lang=${l}`;
  });

  // Optional: x-default fallback
  (alternates.languages as Record<string, string>)['x-default'] = canonicalUrl;

  return {
    title: localizedTitle,
    description: localizedDescription,
    openGraph: {
      title: localizedTitle,
      description: localizedDescription,
      url: canonicalUrl,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description: localizedDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const lang = searchParams?.lang || 'en';

  // Fetch post using the selected language
  const post = await getBlogPost(params.slug, lang);

  if (!post) return <div>Post not found</div>;

  return <BlogDetails post={post} />;
}
