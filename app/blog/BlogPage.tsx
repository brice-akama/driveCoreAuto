'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface BlogPost {
  slug: Record<string, string>;   // slug keyed by lang
  title: Record<string, string>;  // title keyed by lang
  content: Record<string, string>;
  author: string;
  imageUrl: string;
  createdAt: string;
}

export default function BlogPage() {
  const { language } = useLanguage();
  const currentLang = language || 'en';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch posts filtered by language
        const res = await fetch(`/api/blog?lang=${currentLang}`);

        if (!res.ok) throw new Error('Failed to fetch blog posts');

        const response = await res.json();

        if (Array.isArray(response.data)) {
          setPosts(response.data);
          setCurrentPage(1); // reset page on language change
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentLang]);

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading blog posts...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-20">
      <h1
        role="heading"
        aria-level={1}
        className="text-4xl font-bold text-center mt-10 md:mt-20"
      >
        Latest Blog Posts
      </h1>

      {currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {currentPosts.map((post) => {
            const localizedTitle = post.title[currentLang] || post.title['en'] || '';
            const localizedImage = post.imageUrl || '';
            const englishSlug = post.slug['en'] || '';

            return (
              <article
                key={englishSlug}  // Use English slug as React key
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
      ) : (
        <p className="text-center col-span-full text-gray-500 mt-10">
          No blog posts available.
        </p>
      )}

      {posts.length > postsPerPage && (
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
