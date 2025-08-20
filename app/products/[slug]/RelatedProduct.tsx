'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useCart } from "@/app/context/CartContext";


interface RelatedProduct {
  id: string;
  name: Record<string, string>; // name is a lang object
  slug: Record<string, string>; // slug is a lang object
  mainImage: string;
  price: number;
  
}

interface RelatedProductsProps {
  currentProductSlug: string;
}



const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductSlug }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<RelatedProduct & {
  description?: Record<string, string>;
  Specifications?: Record<string, string>;
  Shipping?: Record<string, string>;
  Warranty?: Record<string, string>;
} | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false); // To toggle heading
  const { addToWishlist } = useWishlist();
  const { language } = useLanguage();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [hoveredCartButton, setHoveredCartButton] = useState<string | null>(null);
   const { symbol } = useCurrency();
   const { addToCart, openCart } = useCart();



  const BRANDS = ["Toyota", "Nissan", "Subaru", "Honda", "Mazda", "Accessories", "Scion", "Acure", "Lexus"];

  const extractModel = (name: string): string => {
    if (!name) return "UNKNOWN ENGINE";

    const brandPattern = BRANDS.join("|");
    const regex = new RegExp(`(${brandPattern})\\s+(\\w+)`, "i");

    const match = name.match(regex);
    if (match && match[1] && match[2]) {
      return `${match[1].toUpperCase()} ${match[2].toUpperCase()}`;
    }

    const fallback = name.split(" ").slice(0, 2).join(" ");
    return fallback.toUpperCase() || "UNKNOWN ENGINE";
  };

  const handleAddToCart = (
    _id: string,
    slugObj: Record<string, string>,
    nameObj: Record<string, string>,
    price: number,
    mainImage: string,
    currentLang: string
  ) => {
    const slug = slugObj[currentLang] || slugObj["en"] || "";
    const name = nameObj[currentLang] || nameObj["en"] || "";

    addToCart({ slug, name, price, mainImage, quantity: 1 }, currentLang);
    openCart();
  };

  const handleAddToWishlist = (slugObj: Record<string, string>, currentLang: string) => {
    const slug = slugObj[currentLang] || slugObj["en"] || "";
    addToWishlist(slug, currentLang);
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
       const response = await fetch(`/api/products?slug=${currentProductSlug}&lang=${language || "en"}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch related products");
        }

        const related = data.data?.relatedProducts || [];

        if (related.length > 0) {
          const formatted = related.map((product: any) => ({
            id: product.id || product._id,
            name: product.name,
            slug: product.slug,
            mainImage: product.mainImage,
            price: product.price,
          }));
          setRelatedProducts(formatted);
        } else {
          // Fallback logic if no related products
          setIsFallback(true);
          const fallbackRes = await fetch(`/api/products?freeShipping=true&limit=4`); 
          const fallbackData = await fallbackRes.json();

          const formattedFallback = fallbackData.data.map((product: any) => ({
            id: product.id || product._id,
            name: product.name,
            slug: product.slug,
            mainImage: product.mainImage,
            price: product.price,
          }));

          setRelatedProducts(formattedFallback);
        }

      } catch (err: any) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductSlug]);

  if (relatedProducts.length === 0 && loading) {
    return <p className="text-center mt-10">Loading related products...</p>;
  }


  if (loading) return <p>Loading related products...</p>;
  if (error) return <p className="text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mt-10">
        {isFallback ? "You May Also Like" : "Related Products"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const localizedName = product.name?.[language] || product.name?.en || "";
         const englishSlug = product.slug?.en || product.slug?.[language] || "";

          return (
            <div key={product.id} className="group">
              <div className="relative w-full h-[300px] overflow-hidden rounded-lg mt-10">
                <div className="absolute top-2 left-0 bg-white text-xs font-semibold text-black px-2 py-3 rounded shadow z-10">
                    {extractModel(product.name?.[language] || product.name?.en || "")}
                  </div>
                  
                <Link  href={`/products/${englishSlug}?lang=${language || "en"}`} className="block w-full h-full relative">
                <Image
                  src={product.mainImage}
                  alt={localizedName}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                  className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                </Link>

                

                {/* Select Options Button - Centered on Hover */}
              {/* Hover Icons on Top Right */}
<div className="absolute top-3 right-1 z-10 space-y-2">

  {/* Large Devices: hover icons */}
  <div className="hidden lg:flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    {/* Search Icon */}
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHoveredIcon(product.id + "-search")}
      onMouseLeave={() => setHoveredIcon(null)}
    >
      <button
        aria-label="Quick view"
        className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
        onClick={(e) => {
          e.preventDefault();
          setQuickViewProduct(product);

        }}
      >
        <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
      </button>
      {hoveredIcon === product.id + "-search" && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100" style={{ minWidth: "80px" }}>
          Quick view
        </span>
      )}
    </div>

    {/* Wishlist Icon */}
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHoveredIcon(product.id + "-wishlist")}
      onMouseLeave={() => setHoveredIcon(null)}
    >
      <button
        aria-label="Add to wishlist"
        className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
        onClick={(e) => {
          e.preventDefault();
          handleAddToWishlist(product.slug, language);
        }}
      >
        <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
      </button>
      {hoveredIcon === product.id + "-wishlist" && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100" style={{ minWidth: "100px" }}>
          Add to Wishlist
        </span>
      )}
    </div>
  </div>

  {/* Medium Devices: always show both icons */}
  <div className="hidden md:flex lg:hidden flex-col space-y-3">
    {/* Search Icon */}
    <button
      aria-label="Quick view"
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
      onClick={(e) => {
        e.preventDefault();
        setQuickViewProduct(product);

      }}
    >
      <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
    </button>

    {/* Wishlist Icon */}
    <button
      aria-label="Add to wishlist"
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
      onClick={(e) => {
        e.preventDefault();
        handleAddToWishlist(product.slug, language);
      }}
    >
      <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
    </button>
  </div>

  {/* Small Devices: show only wishlist */}
  <div className="flex md:hidden">
    <button
      aria-label="Add to wishlist"
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 w-10 h-10"
      onClick={(e) => {
        e.preventDefault();
        handleAddToWishlist(product.slug, language);
      }}
    >
      <FiHeart className="text-gray-900 w-5 h-5" />
    </button>
  </div>
</div>

              </div>

             <div className="mt-2 text-center">
  <Link href={`/products/${englishSlug}?lang=${language || "en"}`}>
  <h3 className="text-lg font-medium cursor-pointer hover:underline">{localizedName}</h3>
</Link>

  <p className="text-gray-600 mt-1">{symbol}{product.price}</p>
<button
  className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition flex items-center justify-center mx-auto"
  onClick={() => handleAddToCart(product.id, product.slug, product.name, product.price, product.mainImage, language)}
  onMouseEnter={() => setHoveredCartButton(product.id)}
  onMouseLeave={() => setHoveredCartButton(null)}
>
  {hoveredCartButton === product.id ? (
    <FiShoppingCart className="w-5 h-5" />
  ) : (
    "Add to Cart"
  )}
</button>

</div>

            </div>
          );
        })}
      </div>
      {/* Quick View Modal */}
{quickViewProduct && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setQuickViewProduct(null)}
  >
    <div
      className="bg-white w-full max-w-4xl min-h-[500px] rounded-lg shadow-lg flex overflow-hidden relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        className="absolute top-3 right-6 text-gray-500 hover:text-black z-20"
        onClick={() => setQuickViewProduct(null)}
        aria-label="Close modal"
      >
        ✕
      </button>

      {/* Left: Image */}
      <div className="w-1/2 relative group">
        <Image
          src={quickViewProduct.mainImage}
          alt={quickViewProduct.name[language] || quickViewProduct.name.en}
          fill
          className="object-cover"
          unoptimized
        />

        <Link
          href={`/products/${quickViewProduct.slug.en}?lang=${language}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-800 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full text-center"
        >
          View Details
        </Link>
      </div>

      {/* Right: Details */}
      <div className="w-1/2 p-6 flex flex-col justify-between max-h-[500px] overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {quickViewProduct.name[language] || quickViewProduct.name.en}
          </h2>
          <p className="text-lg font-semibold mb-4">
            {symbol}{quickViewProduct.price}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <button
              className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-black"
              onClick={() => {
                handleAddToCart(
                  quickViewProduct.id,
                  quickViewProduct.slug,
                  quickViewProduct.name,
                  quickViewProduct.price,
                  quickViewProduct.mainImage,
                  language
                );
                setQuickViewProduct(null);
              }}
            >
              Add to Cart
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
              onClick={() => {
                handleAddToWishlist(quickViewProduct.slug, language);
                setQuickViewProduct(null);
              }}
            >
              <FiHeart />
              Add to Wishlist
            </button>
          </div>

          {/* Description & Other Sections */}
          {quickViewProduct.description && (
            <>
              <h3 className="font-semibold text-lg mb-1">Description</h3>
              <p>{quickViewProduct.description[language] || quickViewProduct.description.en}</p>
            </>
          )}
          {/* Description & Other Sections */}
          {quickViewProduct.Specifications && (
            <>
              <h3 className="font-semibold text-lg mb-1">Specifications</h3>
              <p>{quickViewProduct.Specifications[language] || quickViewProduct.Specifications.en}</p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default RelatedProducts;
