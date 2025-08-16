"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
  customerName: string;
  reviewContent: string;
  rating: number;
  avatarUrl: string;
  createdAt: string;
  location?: string;
}

const ReviewList = ({ productSlug }: { productSlug: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review?slug=${productSlug}`);
        const result = await response.json();
        console.log("Fetched Reviews:", result);

        if (!result.data || result.data.length === 0) {
          console.warn("No reviews found", result);
          setReviews([]);
          return;
        }

        setReviews(result.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (productSlug) fetchReviews();
  }, [productSlug]);

  const renderStars = (rating: number) => "⭐".repeat(rating).padEnd(5, "☆");

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const displayedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 italic">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <>
          <ul className="space-y-6">
            {displayedReviews.map((review, index) => (
              <li
                key={index}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex items-start space-x-4">
                  <Image
                    src={review.avatarUrl}
                    alt={review.customerName}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg">{review.customerName}</p>

                      {/* Desktop location */}
                      {review.location && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            review.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden sm:flex items-center gap-1 text-sm hover:underline"
                        >
                          <MapIcon />
                          {review.location}
                        </a>
                      )}
                    </div>

                    <p className="text-yellow-500">{renderStars(review.rating)}</p>
                    <p className="mt-2 text-gray-700">{review.reviewContent}</p>

                    <p className="text-sm text-gray-500 mt-1 flex flex-col">
                      {new Date(review.createdAt).toLocaleDateString()}

                      {/* Mobile location under date */}
                      {review.location && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            review.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex sm:hidden items-center gap-1 mt-1 hover:underline"
                        >
                          <MapIcon />
                          {review.location}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Reusable map icon
const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-red-600"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>
);

export const useReviewCount = (productSlug: string) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await fetch(`/api/review?slug=${productSlug}`);
        const result = await response.json();
        setCount(result?.data?.length || 0);
      } catch (error) {
        console.error("Error fetching review count:", error);
        setCount(0);
      }
    };

    if (productSlug) fetchReviewCount();
  }, [productSlug]);

  return count;
};

export default ReviewList;
