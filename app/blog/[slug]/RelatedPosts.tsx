'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';

interface BlogPost {
  id: string;
  slug: Record<string, string>;
  title: Record<string, string>;
  imageUrl?: string;
}

interface RelatedPostsProps {
  posts?: BlogPost[];    // optional, fallback to fetch if undefined
  category?: string;     // optional category to fetch fallback posts
  limit?: number;        // optional limit for fallback fetch
}

export default function RelatedPosts({
  posts: initialPosts,
  category = 'relatedBlog',
  limit = 3,
}: RelatedPostsProps) {
  const { language, translate } = useLanguage();
  const currentLang = language || 'en';

  const [posts, setPosts] = useState<BlogPost[] | null>(initialPosts || null);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [translatedTexts, setTranslatedTexts] = useState({
    relatedTitle: 'Related Posts',
    readMore: 'Read More',
    loading: 'Loading related posts...',
    error: 'Error loading related posts',
  });

  // Update static translations whenever language changes
  useEffect(() => {
    const updateTranslations = async () => {
      setTranslatedTexts({
        relatedTitle: await translate('Related Posts'),
        readMore: await translate('Read More'),
        loading: await translate('Loading related posts...'),
        error: await translate('Error loading related posts'),
      });
    };
    updateTranslations();
  }, [currentLang, translate]);

  // Fetch fallback posts if initialPosts not provided
  useEffect(() => {
    if (!initialPosts) {
      setLoading(true);
      fetch(`/api/blog?category=${encodeURIComponent(category)}&limit=${limit}&lang=${currentLang}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch related posts');
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data.data)) setPosts(data.data);
          else setPosts([]);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [initialPosts, category, limit, currentLang]);

  if (loading) return <p className="text-center py-8 text-gray-600">{translatedTexts.loading}</p>;
  if (error) return <p className="text-center py-8 text-red-500">{translatedTexts.error}: {error}</p>;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Fade-in heading */}
      <motion.h2
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {translatedTexts.relatedTitle}
      </motion.h2>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {posts.map((post) => {
            const englishSlug = post.slug['en'] || '';
            const localizedTitle = post.title[currentLang] || post.title['en'] || '';

            return (
              <motion.div
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
                whileHover={{ scale: 1.03, boxShadow: '0px 20px 30px rgba(0,0,0,0.15)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={localizedTitle}
                    width={500}
                    height={300}
                    unoptimized
                    className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 truncate max-w-full">{localizedTitle}</h3>
                  <Link href={`/blog/${englishSlug}?lang=${currentLang}`} className="inline-block mt-4">
                    <motion.span
                      className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      {translatedTexts.readMore}
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
