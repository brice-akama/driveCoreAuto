'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 

type ReviewFormProps = {
  productName: string;
  slug: string; // Add slug to props
};

const ReviewForm = ({ productName, slug }: ReviewFormProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [ratingsCount, setRatingsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [starDistribution, setStarDistribution] = useState<number[]>([0, 0, 0, 0, 0]);


  // 1️⃣ First, define the fetchRatingSummary function
  const fetchRatingSummary = async () => {
    try {
      const res = await fetch(`/api/review?slug=${slug}`);
      const json = await res.json();
      if (json.ratingSummary) {
        setRatingsCount(json.ratingSummary.ratingCount);
        setAverageRating(json.ratingSummary.averageRating);
        setStarDistribution(json.ratingSummary.starDistributions);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  // 2️⃣ Call it once when the component mounts
  useEffect(() => {
    fetchRatingSummary();
  }, []);


  // 3️⃣ Handle review submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !customerName || !reviewContent) {
       toast.error('Please fill all fields'); // 👈 toast instead of alert
      return;
    }

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, customerName, reviewContent, rating }),
      });

      const result = await response.json();
      if (response.ok) {
      toast.success(result.message || 'Review submitted successfully ✅');
      await fetchRatingSummary();
      setRating(null);
      setCustomerName('');
      setReviewContent('');
    } else {
      toast.error(result.message || 'Failed to submit review ❌');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error('There was an error submitting your review.');
  }
};


  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      
      <h2 className="text-xl font-semibold mb-4">{productName}</h2>

      {/* Star Rating Section */}
      <div className="mb-4">
        <span>My Rating (required):</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className={`cursor-pointer text-2xl ${
                ((hoverRating ?? rating) !== null && (hoverRating ?? rating)! >= star) ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Customer Name */}
      <div className="mb-4">
        <label htmlFor="customerName" className="block text-sm font-medium mb-2">Customer Name:</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your name"
        />
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <label htmlFor="reviewContent" className="block text-sm font-medium mb-2">Review Content:</label>
        <textarea
          id="reviewContent"
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Write your review"
          rows={5}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Submit Review
      </button>

      {/* Ratings Summary */}
   {/* Ratings Summary */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-4">Ratings Summary</h3>
  {ratingsCount > 0 ? (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="flex items-center space-x-3">
        <span className="text-5xl font-bold text-yellow-500">
          {averageRating.toFixed(1)}
        </span>
        <div className="flex space-x-1 text-yellow-500 text-2xl">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>
              {averageRating >= index + 1
                ? '★'
                : averageRating >= index + 0.5
                ? '★'
                : '☆'}
            </span>
          ))}
        </div>
        <span className="text-gray-500 text-sm mt-2">
          ({ratingsCount} ratings)
        </span>
      </div>

      {/* Star Distribution */}
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => {
          const star = 5 - index;
          const count = starDistribution[star - 1] || 0;
          const percentage =
            ratingsCount > 0 ? ((count / ratingsCount) * 100).toFixed(1) : 0;

          return (
            <div key={star} className="flex items-center gap-2">
              <span className="w-12 text-sm text-gray-700">{star} star</span>
              <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
  )}
</div>

    </div>
  );
};

export default ReviewForm;