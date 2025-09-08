'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiHeart, FiShoppingCart, FiFacebook, FiTwitter } from "react-icons/fi";
import { useWishlist } from "@/app/context/WishlistContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: Record<string, string>;
  price: number;
  discountPercent?: number; // optional, 0 if no discount
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  thumbnails?: string[];
  slug: Record<string, string>;
  Specifications: Record<string, string>;
  Shipping: Record<string, string>;
  Warranty: Record<string, string>; 
};

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
}

const BRANDS = ["Toyota", "Nissan", "Subaru", "Honda", "Mazda"];
const extractModel = (name: string): string => {
  if (!name) return "UNKNOWN ENGINE";
  const brandPattern = BRANDS.join("|");
  const regex = new RegExp(`(${brandPattern})\\s+(\\w+)`, "i");
  const match = name.match(regex);
  if (match && match[1] && match[2]) return `${match[1].toUpperCase()} ${match[2].toUpperCase()}`;
  const fallback = name.split(" ").slice(0, 2).join(" ");
  return fallback.toUpperCase() || "UNKNOWN ENGINE";
};

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg">("lg");
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) setBreakpoint("sm");
      else if (window.innerWidth < 1024) setBreakpoint("md");
      else setBreakpoint("lg");
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return breakpoint;
}

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToWishlist } = useWishlist();
  const { translate, language } = useLanguage();
  const currentLang = language || "en";
  const { addToCart, openCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { symbol } = useCurrency();
  
  


  // Fly-to-cart animation state
  const [flyCart, setFlyCart] = useState<{
    image: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const [translatedTexts, setTranslatedTexts] = useState({
    title: "Best-Selling Engine Components",
    description: `Premium quality engine parts sourced from trusted manufacturers.\nExperience performance and reliability with every component.`,
    addtoCart: "Add to Cart",
    addtoWishlist: "Add to Wishlist",
    specifications: "Specifications",
  shipping: "Shipping & Delivery",
  warranty: "Warranty",
  quickView: "Quick View",
  viewDetails: "View Details",
  });

  useEffect(() => {
    async function translateTexts() {
      const translatedTitle = await translate("Best-Selling Engine Components");
      const translatedDescription = await translate(
        "Premium quality engine parts sourced from trusted manufacturers.\nExperience performance and reliability with every component."
      );
      const translatedAddToCart = await translate("Add to Cart");
      const translatedAddToWishlist = await translate("Add to Wishlist");
      const translatedSpecifications = await translate("Specifications");
    const translatedShipping = await translate("Shipping & Delivery");
    const translatedWarranty = await translate("Warranty");
    const translatedQuickView = await translate("Quick View");
    const translatedViewDetails = await translate("View Details");

      setTranslatedTexts({
        title: translatedTitle,
        description: translatedDescription,
        addtoCart: translatedAddToCart,
        addtoWishlist: translatedAddToWishlist,
        specifications: translatedSpecifications,
      shipping: translatedShipping,
      warranty: translatedWarranty,
      quickView: translatedQuickView,
      viewDetails: translatedViewDetails,
      });
    }
    translateTexts();
  }, [language, translate]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?limit=8");
        const { data } = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, e?: React.MouseEvent<HTMLButtonElement>) => {
  const priceToUse =
    product.discountPercent && product.discountPercent > 0
      ? product.price - (product.price * product.discountPercent) / 100
      : product.price;

  if (e) {
    // Fly to cart animation only if event exists
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      setFlyCart({
        image: product.mainImage,
        startX: rect.left,
        startY: rect.top,
        endX: cartRect.left + cartRect.width / 2 - 32,
        endY: cartRect.top + cartRect.height / 2 - 32,
      });
    }
  }

  addToCart(
    {
      slug: product.slug[currentLang] || product.slug.en,
      name: product.name[currentLang] || product.name.en,
      price: priceToUse,
      mainImage: product.mainImage,
      quantity: 1,
      originalPrice: 0
    },
    currentLang
  );
  openCart();
};

  const handleAddToWishlist = (slugObj: Record<string, string>, currentLang: string) => {
    const slug = slugObj[currentLang] || slugObj["en"] || "";
    addToWishlist(slug, currentLang);
  };

  return (
    <div className="p-4">
      {/* Heading */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{translatedTexts.title}</h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto whitespace-pre-line">
          {translatedTexts.description}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentLang={currentLang}
            addToWishlist={() => handleAddToWishlist(product.slug, currentLang)}
            addToCart={handleAddToCart}
            setQuickViewProduct={setQuickViewProduct}
            translatedTexts={translatedTexts}
          />
        ))}
      </div>

      {/* Quick View Modal */}
{/* Quick View Modal */}
<AnimatePresence>
  {quickViewProduct && (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setQuickViewProduct(null)}
    >
      <motion.div
        className="bg-white w-full max-w-4xl min-h-[500px] rounded-lg shadow-lg flex overflow-hidden relative"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

        {/* Left: Image with hover button */}
        <div className="w-1/2 relative group">
          <Image
            src={quickViewProduct.mainImage}
            alt={quickViewProduct.name[currentLang] || quickViewProduct.name.en}
            fill
            unoptimized
            className="object-cover"
          />
          <Link
            href={`/products/${quickViewProduct.slug.en}?lang=${currentLang}`}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-800 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full text-center"
          >
             {translatedTexts.viewDetails}    
          </Link>
        </div>

        {/* Right: Details */}
        <div className="w-1/2 p-6 flex flex-col justify-between max-h-[500px] overflow-y-auto">
          {(() => {
            // ✅ Discount calculation
            const hasDiscount = (quickViewProduct.discountPercent ?? 0) > 0;
            const discountedPrice = hasDiscount
              ? quickViewProduct.price - (quickViewProduct.price * (quickViewProduct.discountPercent ?? 0)) / 100
              : quickViewProduct.price;

            return (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {quickViewProduct.name[currentLang] || quickViewProduct.name.en}
                </h2>
                <p className="text-lg font-semibold mb-4">
                  {symbol}{discountedPrice.toFixed(2)}
                  {hasDiscount && (
                    <span className="text-blue-600 line-through ml-2">
                      {symbol}{quickViewProduct.price.toFixed(2)}
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-800 whitespace-nowrap text-white px-4 py-2 rounded hover:bg-black"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    {translatedTexts.addtoCart}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-red-500 whitespace-nowrap text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                    onClick={() => {
                      handleAddToWishlist(quickViewProduct.slug, currentLang);
                      setQuickViewProduct(null);
                    }}
                  >
                    <FiHeart />
                    {translatedTexts.addtoWishlist}
                  </motion.button>

                  {/* Social links */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/products/${quickViewProduct.slug.en}?lang=${currentLang}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiFacebook size={24} />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/products/${quickViewProduct.slug.en}?lang=${currentLang}`)}&text=${encodeURIComponent(`Check out this product: ${quickViewProduct.name[currentLang] || quickViewProduct.name.en}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <FiTwitter size={24} />
                  </a>
                </div>

                {/* Specifications */}
                <h3 className="font-semibold text-lg mb-1">{translatedTexts.specifications}</h3>
                <div
                  className="product-details"
                  dangerouslySetInnerHTML={{
                    __html: quickViewProduct.Specifications[currentLang] || quickViewProduct.Specifications.en,
                  }}
                ></div>

                <h3 className="font-semibold text-lg mb-1">{translatedTexts.shipping}</h3>
                <div
                  className="product-details"
                  dangerouslySetInnerHTML={{
                    __html: quickViewProduct.Shipping[currentLang] || quickViewProduct.Shipping.en,
                  }}
                ></div>

                <h3 className="font-semibold text-lg mb-1">{translatedTexts.warranty}</h3>
                <div
                  className="product-details"
                  dangerouslySetInnerHTML={{
                    __html: quickViewProduct.Warranty[currentLang] || quickViewProduct.Warranty.en,
                  }}
                ></div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Fly to cart animation */}
      <AnimatePresence>
        {flyCart && (
          <motion.div
            className="fixed w-16 h-16 z-50 pointer-events-none"
            style={{ top: flyCart.startY, left: flyCart.startX }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ top: flyCart.endY, left: flyCart.endX, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={() => setFlyCart(null)}
          >
            <Image
              src={flyCart.image}
              alt="Flying Product"
              width={64}
              height={64}
              unoptimized
              className="rounded"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({
  product,
  currentLang,
  addToWishlist,
  addToCart,
  setQuickViewProduct,
  translatedTexts,
}: {
  product: Product & { thumbnails?: string[] };
  currentLang: string;
  addToWishlist: () => void;
  addToCart: (product: Product, e: React.MouseEvent<HTMLButtonElement>) => void;
  setQuickViewProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  translatedTexts: {
    title: string;
    description: string;
    addtoCart: string;
    addtoWishlist: string;
  };
}) {
  const { symbol } = useCurrency();
  const [hovered, setHovered] = useState(false);
  const breakpoint = useBreakpoint();
  const slugForLang = product.slug.en || "";
  const nameForLang = product.name?.[currentLang] || product.name?.en || "";
  const thumbnail = product.thumbnails?.[0];
  const hasThumbnail = Boolean(thumbnail);
  const [hoverCart, setHoverCart] = useState(false);
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
const discountedPrice = hasDiscount
  ? product.price - (product.price * product.discountPercent!) / 100
  : product.price;



  return (
    <motion.div
      className="relative group flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${slugForLang}?lang=${currentLang}`}>
      



        <div className="w-full aspect-square relative overflow-hidden mt-3">
          {/* Discount Badge */}
  {hasDiscount && (
    <div className="absolute top-2 left-2 z-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
      -{product.discountPercent}% 
    </div>
  )}

  {/* Model Name */}
  <div className="absolute top-10 left-2 bg-white text-xs font-semibold text-black px-2 py-1 rounded shadow z-10 hidden md:block">
    {extractModel(product.name[currentLang] || product.name.en)}
  </div>

          <Image
            src={hovered && hasThumbnail ? thumbnail || product.mainImage : product.mainImage}
            alt={nameForLang}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />

          {/* Icons with tooltip */}
          <motion.div className={`absolute top-3 right-1 flex flex-col space-y-3 z-10`}>
  {/* Desktop hover icons */}
  {breakpoint !== "sm" && hovered && (
    <>
      {/* Quick View */}
      <div className="relative flex items-center">
        <span className="absolute -left-24 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
          Quick View
        </span>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={(e) => { e.preventDefault(); setQuickViewProduct(product); }}
          className="bg-white rounded-full shadow-md p-2 w-10 h-10 flex items-center justify-center"
        >
          <FiSearch className="text-gray-900 w-5 h-5" />
        </motion.button>
      </div>

      {/* Wishlist */}
      <div className="relative flex items-center">
        <span className="absolute -left-28 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
          Add to Wishlist
        </span>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={(e) => { e.preventDefault(); addToWishlist(); }}
          className="bg-white rounded-full shadow-md p-2 w-10 h-10 flex items-center justify-center"
        >
          <FiHeart className="text-gray-900 w-5 h-5" />
        </motion.button>
      </div>
    </>
  )}

  {/* Mobile always-visible wishlist icon */}
  {breakpoint === "sm" && (
    <motion.button
      id="wishlist-icon"
      whileTap={{ scale: 1.2 }}
      onClick={(e) => { e.preventDefault(); addToWishlist(); }}
      className="bg-white rounded-full shadow-md p-2 w-10 h-10 flex items-center justify-center"
    >
      <FiHeart className="text-black w-5 h-5" />
    </motion.button>
  )}
</motion.div>

        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-6 text-center flex flex-col flex-grow">
        <Link href={`/products/${slugForLang}?lang=${currentLang}`}>
          <h3 className="text-lg font-semibold hover:underline min-h-[3.5rem] leading-tight">
            {nameForLang}
          </h3>
        </Link>
      
       <div className="mt-2 text-center flex justify-center items-center gap-2">
  {hasDiscount && (
    <span className="text-blue-600 font-medium line-through">
      {symbol}{product.price.toFixed(2)}
    </span>
  )}
  <span className="text-lg font-semibold text-gray-900">
    {symbol}{discountedPrice.toFixed(2)}
  </span>
</div>



<motion.div
  className="mt-2 relative flex justify-center"
  onMouseEnter={() => setHoverCart(true)}
  onMouseLeave={() => setHoverCart(false)}
>
  {/* Main button */}
<motion.button
  className="w-full bg-blue-800 text-white px-4 py-1 rounded"
  whileHover={{ scale: 1.03 }}
  onClick={(e) => addToCart(product, e)} // ✅ pass both product and event
>
  {translatedTexts.addtoCart}
</motion.button>



  {/* Floating hover cart icon */}
  {hoverCart && (
    <motion.button
      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-md flex items-center justify-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => addToCart(product, e)}
// same action as button
    >
      <FiShoppingCart className="text-gray-900 w-6 h-6" />
    </motion.button>
  )}
</motion.div>



      </div>
    </motion.div>
  );
}