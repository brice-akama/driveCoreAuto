'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/app/context/LanguageContext";

interface BlogPostType {
  slug: Record<string, string>;
  title: Record<string, string>;
  imageUrl: string;
  createdAt: string;
  excerpt?: Record<string, string>;
}

export default function BlogPost() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<BlogPostType | null>(null);

  const { language, translate } = useLanguage(); // current language

  const [translatedTexts, setTranslatedTexts] = useState({
    latestTitle: "DriveCore Journal",
    viewAll: "View All Articles",
    readMore: "Read More",
  });

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`/api/blog?category=Engine&limit=3&lang=${language}`);
        if (!res.ok) throw new Error('Failed to fetch recent blog posts');
        const response = await res.json();
        if (Array.isArray(response.data)) setPosts(response.data);
        else throw new Error('Unexpected API response format');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [language]);

  // Fetch translations
  useEffect(() => {
    async function fetchTranslations() {
      const latestTitle = await translate("DriveCore Journal");
      const viewAll = await translate("View All Articles");
      const readMore = await translate("Read More");
      setTranslatedTexts({
        latestTitle: latestTitle || "DriveCore Journal",
        viewAll: viewAll || "View All Articles",
        readMore: readMore || "Read More",
      });
    }
    fetchTranslations();
  }, [language, translate]);

  if (loading)
    return <p className="text-center text-gray-600 animate-pulse">Loading posts...</p>;
  if (error)
    return <p className="text-center  text-red-500 font-medium">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{translatedTexts.latestTitle}</h2>
        <Link href={`/blog?lang=${language}`} className="text-green-600 hover:text-green-800 flex items-center space-x-1">
          <span className="text-lg font-medium">{translatedTexts.viewAll}</span>
          <span>&gt;</span>
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div
              key={post.slug.en}
              className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
              onClick={() => setActivePreview(post)}
            >
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title[language] || post.title.en}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                {/* Optional date badge */}
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 truncate">
                  {post.title[language] || post.title.en}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt[language] || post.excerpt.en}</p>
                )}
                <motion.span
  whileHover={{ scale: 1.05 }}
  className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
  onClick={(e) => e.stopPropagation()} // Prevent card click
>
  <Link href={`/blog/${post.slug.en}?lang=${language}`}>
    {translatedTexts.readMore}
  </Link>
</motion.span>

              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No blog posts available</p>
        )}
      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePreview(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-3xl w-full p-6 relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setActivePreview(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

              {/* Image */}
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={activePreview.imageUrl}
                  alt={activePreview.title[language] || activePreview.title.en}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold mb-3">
                {activePreview.title[language] || activePreview.title.en}
              </h2>
              {activePreview.excerpt && (
                <p className="text-gray-700 mb-4">
                  {activePreview.excerpt[language] || activePreview.excerpt.en}
                </p>
              )}
              <Link
                href={`/blog/${activePreview.slug.en}?lang=${language}`}
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {translatedTexts.readMore}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
