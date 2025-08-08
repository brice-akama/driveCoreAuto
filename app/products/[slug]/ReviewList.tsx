'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
  customerName: string;
  reviewContent: string;
  rating: number;
  avatarUrl: string;
  createdAt: string;
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
        console.log('Fetched Reviews:', result); // Log the result for debugging
  
        // If no data is found, return early
        if (!result.data || result.data.length === 0) {
          console.error("No reviews found", result);
          return;
        }
  
        // Set reviews as an array, even if it's a single review in an array
        setReviews(result.data);
  
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    if (productSlug) {
      fetchReviews();
    }
  }, [productSlug]);
  

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating).padEnd(5, "☆");
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const displayedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        <>
          <ul className="space-y-6">
            {displayedReviews.map((review, index) => (
              <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <Image
                    src={review.avatarUrl}
                    alt={review.customerName}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="overflow-visible">
                    <p className="font-semibold text-lg">{review.customerName}</p>
                    <p className="text-yellow-500">{renderStars(review.rating)}</p>
                    <p className="mt-2 text-gray-700 ">{review.reviewContent}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export const useReviewCount = (productSlug: string) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await fetch(`/api/review?slug=${productSlug}`);
        const result = await response.json();

        if (result?.data) {
          setCount(result.data.length);
        } else {
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching review count:", error);
        setCount(0);
      }
    };

    if (productSlug) {
      fetchReviewCount();
    }
  }, [productSlug]);

  return count;
};


export default ReviewList;