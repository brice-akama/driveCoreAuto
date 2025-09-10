// app/components/ReviewsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";




type Review = {
  product: string;
  rating: number;
  text: string;
  author: string;
  location: string;
};

const reviewsStatic: Review[] = [
  {
    product: "K20A Engine",
    rating: 5,
    text: "Engine arrived in great condition, clean and strong compression. Installed easily and runs perfectly.",
    author: "Michael R.",
    location: "Toronto, ON",
  },
  {
    product: "K24A2 Engine",
    rating: 5,
    text: "Solid motor, no leaks, and very responsive. A great upgrade for my build.",
    author: "Daniel K.",
    location: "Vancouver, BC",
  },
  {
    product: "VQ35DE Engine",
    rating: 4,
    text: "Good running engine, packaged well. Needed minor maintenance but overall excellent.",
    author: "Alex P.",
    location: "Montreal, QC",
  },
  {
    product: "VG30DE Engine",
    rating: 5,
    text: "Perfect replacement for my project car. Fired right up and runs smooth.",
    author: "Chris L.",
    location: "Calgary, AB",
  },
  {
    product: "5-Speed Transmission",
    rating: 5,
    text: "Shifts smoothly with no grinding. Exactly as described and works flawlessly.",
    author: "David S.",
    location: "Ottawa, ON",
  },
  {
    product: "6-Speed Transmission",
    rating: 4,
    text: "Strong gearbox, handles power well. Slight delay in delivery but product is excellent.",
    author: "Ryan T.",
    location: "Edmonton, AB",
  },
  {
    product: "Automatic Transmission",
    rating: 5,
    text: "Transmission was clean, tested, and works like new. Very satisfied with this purchase.",
    author: "Kevin B.",
    location: "Vancouver, BC",
  },
  {
    product: "Engine Swap Kit",
    rating: 5,
    text: "All parts included for the swap. Fitment was perfect and install was smooth.",
    author: "Jason M.",
    location: "Toronto, ON",
  },
  {
    product: "Front Subframe",
    rating: 5,
    text: "Bolted right up with no modifications. Strong and reliable build quality.",
    author: "Mark W.",
    location: "Montreal, QC",
  },
  {
    product: "Rear Subframe",
    rating: 4,
    text: "Good condition and fitment. Needed minor cleaning, but otherwise perfect.",
    author: "Anthony J.",
    location: "Calgary, AB",
  },
  {
    product: "Driveshaft Assembly",
    rating: 5,
    text: "Fits perfectly and handles high torque with no issues. Very durable piece.",
    author: "Sophia H.",
    location: "Ottawa, ON",
  },
  {
    product: "Axle Set",
    rating: 5,
    text: "Heavy duty and reliable. Installed quickly and works flawlessly under load.",
    author: "Lucas F.",
    location: "Edmonton, AB",
  },
  {
    product: "Clutch Kit",
    rating: 5,
    text: "Smooth engagement, strong grip. A noticeable improvement in performance.",
    author: "Emma L.",
    location: "Toronto, ON",
  },
  {
    product: "Flywheel",
    rating: 4,
    text: "Well-machined and balanced. Works perfectly, though shipping took longer than expected.",
    author: "Benjamin T.",
    location: "Vancouver, BC",
  },
  {
    product: "Differential",
    rating: 5,
    text: "Strong and quiet. Handles power very well. Highly recommend this replacement part.",
    author: "Olivia D.",
    location: "Calgary, AB",
  },
  {
    product: "Radiator",
    rating: 5,
    text: "Keeps engine temps stable even under heavy load. Build quality is excellent.",
    author: "William S.",
    location: "Montreal, QC",
  },
  {
    product: "Intercooler",
    rating: 4,
    text: "Solid cooling performance, noticeable power gains. A bit bulky but works perfectly.",
    author: "Charlotte M.",
    location: "Ottawa, ON",
  },
  {
    product: "Exhaust Manifold",
    rating: 5,
    text: "Perfect fit and high-quality welds. Improved flow and performance immediately.",
    author: "Noah K.",
    location: "Edmonton, AB",
  },
  {
    product: "Throttle Body",
    rating: 5,
    text: "Direct bolt-on, improved throttle response instantly. Very happy with this upgrade.",
    author: "Ava P.",
    location: "Toronto, ON",
  },
  {
    product: "Fuel Rail",
    rating: 5,
    text: "Sturdy build and delivers fuel consistently. Easy installation and works perfectly.",
    author: "Liam J.",
    location: "Vancouver, BC",
  },
];


export default function ReviewsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsPerPage, setReviewsPerPage] = useState(12);
  const [showModal, setShowModal] = useState(false); // <-- modal state
  const [newReview, setNewReview] = useState<Review>({
    product: "",
    rating: 0,
    text: "",
    author: "",
    location: "",
  });


   // Fetch reviews from backend
  // Fetch reviews from backend
const fetchReviews = async () => {
  try {
    const res = await fetch("/api/customers-reviews");
    const data = await res.json();

    if (Array.isArray(data)) {
      // static reviews first, backend reviews after
      setReviews([...reviewsStatic, ...data]);
    } else {
      setReviews(reviewsStatic);
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    setReviews(reviewsStatic); // fallback if API fails
  }
};

// Fetch reviews from API + include static ones
useEffect(() => {
  fetchReviews();
}, []);

  // Pagination function with scroll to top
const paginate = (pageNumber: number) => {
  setCurrentPage(pageNumber);
  // Scroll to top of the reviews section smoothly
  const reviewsSection = document.getElementById("reviews-section");
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: "smooth" });
  }
};


  // Update reviews per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setReviewsPerPage(6); // Phones
      } else {
        setReviewsPerPage(12); // Medium & large devices
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  

   // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit new review to backend
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/customers-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });

    if (!res.ok) throw new Error("Failed to submit review");

    setNewReview({ product: "", rating: 0, text: "", author: "", location: "" });
    setShowModal(false);
    fetchReviews(); // Refresh the review list

    // ✅ Show success toast
    toast.success("Your review has been submitted successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit review. Please try again.");
  }
};



  return (
    <div className="mt-20 lg:mt-40">
  {/* Full-width black section */}
  <div className="bg-black text-white py-8 text-center w-full">
    <h1 className="text-4xl font-black">Reviews</h1>
  </div>

  <section id="reviews-section" className="w-full py-14 px-2">
    <div className="max-w-5xl mx-auto text-center mb-10">
      <h2 className="text-2xl font-bold mb-4">
        What Our Customers Are Saying – Trusted Reviews from Around the World
      </h2>
      <p className="text-gray-700 leading-relaxed">
        At <span className="font-semibold">DriveCore Auto</span>, we are proud to
        supply high-quality engines, transmissions, swaps, subframes, and other
        auto parts to customers across the globe. Whether you’re restoring,
        upgrading, or maintaining your vehicle, our parts are trusted by car
        enthusiasts, repair shops, and professional builders worldwide.
      </p>
      <p className="text-gray-700 leading-relaxed mt-2">
        From North America to Europe, Asia, and beyond, our customers value the
        reliability, performance, and precision of every DriveCore Auto product.
        Each review below reflects the confidence drivers and mechanics place in
        us when it comes to keeping their vehicles running strong.
      </p>
      <p className="text-gray-700 leading-relaxed mt-2">
        Here’s what real customers are saying about their experience with DriveCore Auto parts and service.
      </p>
    </div>


        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {currentReviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-sm text-gray-700 mb-1">
                  <span className="text-gray-800">Product:</span> {review.product}
                </p>
                <blockquote className="italic text-gray-600 mb-6 leading-relaxed">
                  “{review.text}”
                </blockquote>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="font-semibold text-gray-800">{review.author}</span>
                <span className="text-xs text-gray-500">{review.location}</span>
  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      review.location
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-red-600 hover:text-red-800"
    title={`View ${review.location} on Google Maps`}
  >
    <FaMapMarkerAlt className="h-4 w-4" />
  </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              } transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* LEAVE A REVIEW button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition text-base"
          >
            LEAVE A REVIEW
          </button>
        </div>
        {/* Modal */}
{/* Modal */}
{showModal && (
  <div
  onClick={() => setShowModal(false)}
  className="fixed inset-0 flex items-center justify-center z-50">
    <div 
     onClick={(e) => e.stopPropagation()}
    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-[fadeInUp_0.3s_ease]">
      
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        ✕
      </button>

      {/* Title */}
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
        Share Your Experience
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Product */}
        <input
          type="text"
          name="product"
          value={newReview.product}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Rating (Star Picker) */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => setNewReview({ ...newReview, rating: star })}
              className={`h-6 w-6 cursor-pointer transition ${
                star <= newReview.rating
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          ))}
        </div>

        {/* Review Text */}
        <textarea
          name="text"
          value={newReview.text}
          onChange={handleInputChange}
          placeholder="Write your review..."
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Author */}
        <input
          type="text"
          name="author"
          value={newReview.author}
          onChange={handleInputChange}
          placeholder="Your Name"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Location */}
        <input
          type="text"
          name="location"
          value={newReview.location}
          onChange={handleInputChange}
          placeholder="Your Location"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow hover:opacity-90 transition"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </section>
    </div>
  );
}