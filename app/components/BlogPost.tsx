'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from "@/app/context/LanguageContext";

interface BlogPost {
  slug: Record<string, string>;
  title: Record<string, string>;
  imageUrl: string;
  createdAt: string;
}

export default function BlogPost() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { language, translate } = useLanguage(); // Get current language and translate function

  const [translatedTexts, setTranslatedTexts] = useState({
    latestTitle: "Latest in Cannabis Wellness",
    viewAll: "View All Articles",
    readMore: "Read More",
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`/api/blog?category=Engine&limit=3&lang=${language}`);
        if (!res.ok) throw new Error('Failed to fetch recent blog posts');
        const response = await res.json();

        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [language]);

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const latestTitle = await translate("Latest in Cannabis Wellness");
        const viewAll = await translate("View All Articles");
        const readMore = await translate("Read More");
        setTranslatedTexts({
          latestTitle: latestTitle || "Latest in Cannabis Wellness",
          viewAll: viewAll || "View All Articles",
          readMore: readMore || "Read More",
        });
      } catch {
        setTranslatedTexts({
          latestTitle: "Latest in Cannabis Wellness",
          viewAll: "View All Articles",
          readMore: "Read More",
        });
      }
    }

    fetchTranslations();
  }, [language, translate]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Loading posts...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 font-medium">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-10 mt-7">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{translatedTexts.latestTitle}</h2>
        <Link href="/blog" className="text-green-600 hover:text-green-800 flex items-center space-x-1">
          <span className="text-lg font-medium">{translatedTexts.viewAll}</span>
          <span>&gt;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.slug[language]}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <Image
                src={post.imageUrl}
                alt={post.title[language]}
                width={500}
                height={300}
                unoptimized
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 truncate max-w-full">{post.title[language]}</h3>
                <Link href={`/blog/${post.slug[language]}`} className="inline-block mt-4">
                  <span className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    {translatedTexts.readMore}
                  </span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No blog posts available</p>
        )}
      </div>
    </div>
  );
}
