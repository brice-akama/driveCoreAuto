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
  name: Record<string, string>;
  slug: Record<string, string>;
  mainImage: string;
  price: number;
  description?: Record<string, string>;
  Specifications?: Record<string, string>;
  Shipping?: Record<string, string>;
  Warranty?: Record<string, string>;
  discountPrice?: number;       // ✅ optional
  discountPercent?: number;     // ✅ optional
}

interface RelatedProductsProps {
  currentProductSlug: string;
}

// Utility function
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<\/p>/gi, "\n\n") // new paragraph for each </p>
             .replace(/<br\s*\/?>/gi, "\n") // line breaks
             .replace(/<[^>]+>/g, "") // remove all other tags
             .trim();
};


const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductSlug }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<RelatedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [hoveredCartButton, setHoveredCartButton] = useState<string | null>(null);
  
  

  const { language, translate } = useLanguage();
  const { addToWishlist } = useWishlist();
  const { symbol } = useCurrency();
  const { addToCart, openCart } = useCart();

  const [translatedTexts, setTranslatedTexts] = useState({
    relatedProductsHeading: "Related Products",
    fallbackHeading: "You May Also Like",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    quickView: "Quick view",
    viewDetails: "View Details",
  });

  // Translate labels when language changes
  useEffect(() => {
    async function translateTexts() {
      const relatedProductsHeading = await translate("Related Products");
      const fallbackHeading = await translate("You May Also Like");
      const addToCart = await translate("Add to Cart");
      const addToWishlist = await translate("Add to Wishlist");
      const quickView = await translate("Quick view");
      const  viewDetails = await translate("View Details");

      setTranslatedTexts({
        relatedProductsHeading,
        fallbackHeading,
        addToCart,
        addToWishlist,
        quickView,
        viewDetails,
      });
    }
    translateTexts();
  }, [language, translate]);

  const BRANDS = ["Toyota", "Nissan", "Subaru", "Honda", "Mazda", "Accessories", "Scion", "Acure", "Lexus"];
  const extractModel = (name: string) => {
    if (!name) return "UNKNOWN ENGINE";
    const brandPattern = BRANDS.join("|");
    const regex = new RegExp(`(${brandPattern})\\s+(\\w+)`, "i");
    const match = name.match(regex);
    if (match && match[1] && match[2]) return `${match[1].toUpperCase()} ${match[2].toUpperCase()}`;
    const fallback = name.split(" ").slice(0, 2).join(" ");
    return fallback.toUpperCase() || "UNKNOWN ENGINE";
  };

  const handleAddToCart = (_id: string, slugObj: Record<string, string>, nameObj: Record<string, string>, price: number, mainImage: string, currentLang: string) => {
    const slug = slugObj[currentLang] || slugObj["en"] || "";
    const name = nameObj[currentLang] || nameObj["en"] || "";
    addToCart({
      slug, name, price, mainImage, quantity: 1,
      originalPrice: 0
    }, currentLang);
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

      // ✅ Instead of throwing error, check gracefully
      if (response.ok && data?.data?.relatedProducts?.length > 0) {
        // Normal related products
        const related = data.data.relatedProducts;
        setRelatedProducts(
          related.map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
            slug: p.slug,
            mainImage: p.mainImage,
            price: p.price,
            description: p.description,
            Specifications: p.Specifications,
            Shipping: p.Shipping,
            Warranty: p.Warranty,
            discountPercent: p.discountPercent || 0,
discountPrice: p.discountPercent
  ? p.price - (p.price * p.discountPercent) / 100
  : p.price,
            // optional if API provides
          }))
        );
      } else {
        // ✅ Fallback if no related products or API error
        setIsFallback(true);
        const fallbackRes = await fetch(`/api/products?freeShipping=true&limit=4`);
        const fallbackData = await fallbackRes.json();

        if (fallbackRes.ok) {
          setRelatedProducts(
            fallbackData.data.map((p: any) => ({
              id: p.id || p._id,
              name: p.name,
              slug: p.slug,
              mainImage: p.mainImage,
              price: p.price,
              description: p.description,
              Specifications: p.Specifications,
              Shipping: p.Shipping,
              Warranty: p.Warranty,
            }))
          );
        }
      }
    } catch (err: any) {
      console.warn("⚠️ Falling back to default products due to error:", err.message);

      // ✅ Final fallback (in case both requests fail)
      setIsFallback(true);
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchRelatedProducts();
}, [currentProductSlug, language]);


  if (loading) return <p>Loading related products...</p>;
  if (error) return <p className="text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mt-10">
        {isFallback ? translatedTexts.fallbackHeading : translatedTexts.relatedProductsHeading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => {
          const localizedName = product.name?.[language] || product.name?.en || "";
          const englishSlug = product.slug?.en || product.slug?.[language] || "";
          {/*
  Check if product has a discount
  We'll use discountPercent if available
*/}
const hasDiscount = (product.discountPrice ?? product.price) < product.price;
const discountedPrice = hasDiscount
  ? product.price - (product.price * product.discountPercent!) / 100
  : product.price;


          return (
            <div key={product.id} className="group">
              <div className="relative w-full h-[300px] overflow-hidden rounded-lg mt-10">

                {/* Discount Badge */}
{hasDiscount && (
  <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
    -{product.discountPercent}%
  </div>
)}
     <div className="absolute top-2 left-0 bg-white text-xs font-semibold text-black px-2 py-3 rounded shadow z-10">
                  {extractModel(localizedName)}
                </div>

                <Link href={`/products/${englishSlug}?lang=${language || "en"}`} className="block w-full h-full relative">
                  <Image
                    src={product.mainImage}
                    alt={localizedName}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                    className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Hover icons */}
                <div className="absolute top-3 right-1 z-10 space-y-2">
                  {/* Large devices */}
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
                          setQuickViewProduct(product); // OPEN MODAL
                        }}
                      >
                        <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
                      </button>
                      {hoveredIcon === product.id + "-search" && (
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100">
                          {translatedTexts.quickView}
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
                        className="bg-white rounded-full shadow-md flex items-center justify-center p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(product.slug, language);
                        }}
                      >
                        <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
                      </button>
                      {hoveredIcon === product.id + "-wishlist" && (
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100">
                          {translatedTexts.addToWishlist}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center">
                <Link href={`/products/${englishSlug}?lang=${language || "en"}`}>
                  <h3 className="text-lg font-medium cursor-pointer hover:underline">{localizedName}</h3>
                </Link>
<p className="mt-1 text-lg font-semibold">
  {hasDiscount ? (
    <>
      <span className="line-through text-gray-500 mr-2">
        {symbol}{product.price.toFixed(2)}
      </span>
      <span className="text-blue-600">
        {symbol}{product.discountPrice!.toFixed(2)}
      </span>
    </>
  ) : (
    <span className="text-blue-600">
      {symbol}{product.price.toFixed(2)}
    </span>
  )}
</p>

                <button
  className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition flex items-center justify-center mx-auto"
  onClick={() =>
    handleAddToCart(product.id, product.slug, product.name, discountedPrice, product.mainImage, language)
  }
  onMouseEnter={() => setHoveredCartButton(product.id)}
  onMouseLeave={() => setHoveredCartButton(null)}
>
  {hoveredCartButton === product.id ? <FiShoppingCart className="w-5 h-5" /> : translatedTexts.addToCart}
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
            <button
              className="absolute top-3 right-6 text-gray-500 hover:text-black z-20"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Left Image with View Details Overlay */}
            <div className="w-1/2 relative group">
  <Image
    src={quickViewProduct.mainImage}
    alt={quickViewProduct.name[language] || quickViewProduct.name.en}
    fill
    className="object-cover"
    unoptimized
  />
  <Link
    href={`/products/${quickViewProduct.slug.en}?lang=${language || "en"}`}
    className="absolute bottom-0 left-0 w-full bg-blue-500 text-white text-lg font-semibold py-2 text-center opacity-0 group-hover:opacity-100 transition"
  >
      {translatedTexts.viewDetails}
  </Link>
</div>



            {/* Right Details */}
            <div className="w-1/2 p-6 flex flex-col justify-between max-h-[500px] overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {quickViewProduct.name[language] || quickViewProduct.name.en}
                </h2>
<p className="text-lg font-semibold mb-4">
  {(quickViewProduct.discountPercent ?? 0) > 0 ? (
    <>
      {/* Original price */}
      <span className="line-through text-gray-500 mr-2">
        {symbol}{quickViewProduct.price.toFixed(2)}
      </span>
      {/* Discounted price */}
      <span className="text-blue-600">
        {symbol}{(
          quickViewProduct.price -
          (quickViewProduct.price * quickViewProduct.discountPercent!) / 100
        ).toFixed(2)}
      </span>
    </>
  ) : (
    <span className="text-blue-600">
      {symbol}{quickViewProduct.price.toFixed(2)}
    </span>
  )}
</p>


                <div className="flex items-center gap-4 mb-6">
                  <button
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
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
                    {translatedTexts.addToCart}
                  </button>

                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                    onClick={() => {
                      handleAddToWishlist(quickViewProduct.slug, language);
                      setQuickViewProduct(null);
                    }}
                  >
                    <FiHeart />
                    {translatedTexts.addToWishlist}
                  </button>
                </div>

               

{quickViewProduct.Specifications && (
  <>
    <h3 className="font-semibold text-lg mb-1">Specifications</h3>
    <p className="whitespace-pre-line">
      {stripHtml(quickViewProduct.Specifications[language] || quickViewProduct.Specifications.en)}
    </p>
  </>
)}

{quickViewProduct.Shipping && (
  <>
    <h3 className="font-semibold text-lg mb-1">Shipping</h3>
    <p className="whitespace-pre-line">
      {stripHtml(quickViewProduct.Shipping[language] || quickViewProduct.Shipping.en)}
    </p>
  </>
)}

{quickViewProduct.Warranty && (
  <>
    <h3 className="font-semibold text-lg mb-1">Warranty</h3>
    <p className="whitespace-pre-line">
      {stripHtml(quickViewProduct.Warranty[language] || quickViewProduct.Warranty.en)}
    </p>
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
