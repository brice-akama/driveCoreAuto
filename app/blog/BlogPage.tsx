// app/blog/BlogPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

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

export default function BlogPage({ initialPosts }: BlogPageProps) {
  const { language } = useLanguage();
  const currentLang = language || 'en';

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = initialPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(initialPosts.length / postsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (!initialPosts.length) {
    return (
      <p className="text-center col-span-full text-gray-500 mt-10">
        No blog posts available.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-20">
      <h1 className="text-4xl font-bold text-center mt-10 md:mt-20">
        Latest Blog Posts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {currentPosts.map((post) => {
          const localizedTitle = post.title[currentLang] || post.title['en'] || '';
          const localizedImage = post.imageUrl || '';
          const englishSlug = post.slug['en'] || '';

          return (
            <article
              key={englishSlug}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <img
                src={localizedImage}
                alt={localizedTitle}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">{localizedTitle}</h2>
                <Link href={`/blog/${englishSlug}?lang=${currentLang}`} className="inline-block mt-4">
                  <span className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Read More
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {initialPosts.length > postsPerPage && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
