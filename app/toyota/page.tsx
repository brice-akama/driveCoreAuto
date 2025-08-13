import { Metadata } from 'next';
import ToyotaPage from './ToyotaPage';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { category?: string; lang?: string };
}): Promise<Metadata> {
  const slug = searchParams?.category;
  const lang = searchParams?.lang || 'en';

  if (!slug) {
    return {
      title: 'Toyota Engine',
      description: 'Browse all our categories and products.',
    };
  }

  const formattedCategory = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category`);
    const result = await res.json();

    if (res.ok && result?.data) {
      const category = result.data.find((cat: any) =>
        Object.values(cat.slug).includes(slug)
      );

      if (category) {
        const title = category.metaTitle?.[lang] || `${formattedCategory} | Toyota Engine`;
        const description =
          category.metaDescription?.[lang] || `Browse our ${formattedCategory} products.`;

        return {
          title,
          description,
          openGraph: {
            title,
            description,
            images: [category.imageUrl],
          },
        };
      }
    }

    return {
      title: `${formattedCategory} | Toyota Engine`,
      description: `Browse our ${formattedCategory} products.`,
    };
  } catch (error) {
    console.error('SEO fetch error:', error);
    return {
      title: 'Toyota Engine',
      description: 'Browse all our categories and products.',
    };
  }
}

export default function Page({
  searchParams,
}: {
  searchParams?: { category?: string; lang?: string };
}) {
  return <ToyotaPage categorySlug={searchParams?.category} />;
}
