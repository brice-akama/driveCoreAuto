// app/blog/BlogPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import Breadcrumb from '../components/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';

export interface BlogPost {
  slug: Record<string, string>;
  title: Record<string, string>;
  content: Record<string, string>;
  author: string;
  imageUrl: string;
  createdAt: string;
}

interface BlogPageProps {
  initialPosts: BlogPost[];
}

// Helper to strip HTML tags
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
}

export default function BlogPage({ initialPosts }: BlogPageProps) {
  const { language } = useLanguage();
  const currentLang = language || 'en';

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = initialPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(initialPosts.length / postsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (!initialPosts.length) {
    return (
      <p className="text-center col-span-full text-gray-500 mt-10">
        No blog posts available.
      </p>
    );
  }

  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">Blog</h1>
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-center mb-10">Latest Blog Posts</h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentPosts.map((post) => {
              const localizedTitle = post.title[currentLang] || post.title['en'] || '';
              const localizedImage = post.imageUrl || '';
              const localizedSlug = post.slug[currentLang] || post.slug['en'] || '';
              const previewContent = stripHtml(post.content[currentLang] || post.content['en'] || '').slice(0, 150);

              return (
                <motion.article
                  key={localizedSlug}
                  className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.03, boxShadow: '0px 20px 30px rgba(0,0,0,0.15)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Blog Image with hover zoom */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={localizedImage}
                      alt={localizedTitle}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />

                    {/* Optional date badge */}
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>

                    {/* Quick Read Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-4 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="line-clamp-3 text-sm">{previewContent}...</p>
                      <Link href={`/blog/${localizedSlug}?lang=${currentLang}`} className="mt-3 inline-block">
                        <motion.span
                          className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                          whileHover={{ scale: 1.05 }}
                        >
                          Read More
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Blog Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3">{localizedTitle}</h3>
                    <p className="text-gray-600 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                     <Link href={`/blog/${localizedSlug}?lang=${currentLang}`} className="mt-3 inline-block">
                        <motion.span
                          className="bg-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-700"
                          whileHover={{ scale: 1.05 }}
                        >
                          Read More
                        </motion.span>
                      </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {initialPosts.length > postsPerPage && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
