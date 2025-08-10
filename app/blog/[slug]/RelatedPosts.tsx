'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  slug: Record<string, string>;
  title: Record<string, string>;
  imageUrl?: string;
}

interface RelatedPostsProps {
  posts?: BlogPost[];              // optional, fallback to fetch if undefined
  lang: string;
  translatedTexts: {
    readMore: string;
  };
  category?: string;               // optional category to fetch fallback posts
  limit?: number;                 // optional limit for fallback fetch
}

export default function RelatedPosts({
  posts: initialPosts,
  lang,
  translatedTexts,
  category = 'relatedBlog',
  limit = 3,
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogPost[] | null>(initialPosts || null);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPosts) {
      setLoading(true);
      fetch(`/api/blog?category=${encodeURIComponent(category)}&limit=${limit}&lang=${lang}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch related posts');
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data.data)) {
            setPosts(data.data);
          } else {
            setPosts([]);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [initialPosts, category, limit, lang]);

  if (loading) return <p className="text-center py-8 text-gray-600">Loading related posts...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error loading related posts: {error}</p>;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const englishSlug = post.slug['en'] || '';
          const localizedTitle = post.title[lang] || post.title['en'] || '';
          return (
            <div
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={localizedTitle}
                  width={500}
                  height={300}
                  unoptimized
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 truncate max-w-full">
                  {localizedTitle}
                </h3>
                <Link
                  href={`/blog/${englishSlug}?lang=${lang}`}
                  className="inline-block mt-4"
                >
                  <span className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    {translatedTexts.readMore}
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
