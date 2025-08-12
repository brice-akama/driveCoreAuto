'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useWishlist } from "@/app/context/WishlistContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: Record<string, string>;
  price: number;
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  thumbnails?: string[];
  slug: Record<string, string>;
  description: Record<string, string>;
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
  if (match && match[1] && match[2]) {
    return `${match[1].toUpperCase()} ${match[2].toUpperCase()}`;
  }
  const fallback = name.split(" ").slice(0, 2).join(" ");
  return fallback.toUpperCase() || "UNKNOWN ENGINE";
};

// Responsive breakpoint hook
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

let slugForLang = "";
if (quickViewProduct) {
  slugForLang = quickViewProduct.slug[currentLang] || quickViewProduct.slug.en || "";
}


  const [translatedTexts, setTranslatedTexts] = useState({
    title: "Best-Selling Engine Components",
    description: `Premium quality engine parts sourced from trusted manufacturers.\nExperience performance and reliability with every component.`,
    addtoCart: "Add to Cart",
    addtoWishlist: "Add to Wishlist",
  });

  useEffect(() => {
    async function translateTexts() {
      const translatedTitle = await translate("Best-Selling Engine Components");
      const translatedDescription = await translate(
        "Premium quality engine parts sourced from trusted manufacturers.\nExperience performance and reliability with every component."
      );
      const translatedAddToCart = await translate("Add to Cart");
      const translatedAddToWishlist = await translate("Add to Wishlist");

      setTranslatedTexts({
        title: translatedTitle,
        description: translatedDescription,
        addtoCart: translatedAddToCart,
        addtoWishlist: translatedAddToWishlist,
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
            addToCart={(id, slug, name, price, mainImage) =>
              handleAddToCart(id, product.slug, product.name, price, mainImage, currentLang)
            }
            setQuickViewProduct={setQuickViewProduct}
            translatedTexts={translatedTexts}
          />
        ))}
      </div>

      {/* Quick View Modal */}
{quickViewProduct && (
  <div
    className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-black/50"
    onClick={() => setQuickViewProduct(null)} // click outside closes
  >
    <div
      className="bg-white w-full max-w-4xl min-h-[500px] rounded-lg shadow-lg flex overflow-hidden relative"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
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
          className="object-cover"
        />

        {/* View Details button on hover */}
        <Link
  href={`/products/${quickViewProduct?.slug.en}?lang=${currentLang}`}
  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-800 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
>
  View Details
</Link>



      </div>

      {/* Right: Details with scrollbar */}
      <div className="w-1/2 p-6 flex flex-col justify-between max-h-[500px] overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {quickViewProduct.name[currentLang] || quickViewProduct.name.en}
          </h2>
          <p className="text-lg font-semibold mb-4">
            {symbol}{quickViewProduct.price}
          </p>

          {/* Description */}
          {/* ...inside Quick View modal right side */}
<h3 className="font-semibold text-lg mb-1">Description</h3>
<div>
  {(stripHtml(quickViewProduct.description[currentLang] || quickViewProduct.description.en) || "")
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map((paragraph, idx) => (
      <p key={idx} className="mb-4">
        {paragraph}
      </p>
    ))}
</div>


<h3 className="font-semibold text-lg mb-1">Specifications</h3>
<div>
  {(stripHtml(quickViewProduct.Specifications[currentLang] || quickViewProduct.Specifications.en) || "")
    .split(/\n{2,}/) // split on 2 or more newlines
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map((paragraph, idx) => (
      <p key={idx} className="mb-4">
        {paragraph}
      </p>
    ))}
</div>
<h3 className="font-semibold text-lg mb-1">Shipping & delivery</h3>
<div>
  {(stripHtml(quickViewProduct.Shipping[currentLang] || quickViewProduct.Shipping.en) || "")
    .split(/\n{2,}/) // split on 2 or more newlines
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map((paragraph, idx) => (
      <p key={idx} className="mb-4">
        {paragraph}
      </p>
    ))}
</div>
<h3 className="font-semibold text-lg mb-1">Warranty</h3>
<div>
  {(stripHtml(quickViewProduct.Warranty[currentLang] || quickViewProduct.Warranty.en) || "")
    .split(/\n{2,}/) // split on 2 or more newlines
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map((paragraph, idx) => (
      <p key={idx} className="mb-4">
        {paragraph}
      </p>
    ))}
</div>


        </div>

        <button
          className="mt-6 bg-blue-800 text-white px-4 py-2 rounded hover:bg-black self-start"
          onClick={() => {
            handleAddToCart(
              quickViewProduct.id,
              quickViewProduct.slug,
              quickViewProduct.name,
              quickViewProduct.price,
              quickViewProduct.mainImage,
              currentLang
            );
            setQuickViewProduct(null);
          }}
        >
          {translatedTexts.addtoCart}
        </button>
      </div>
    </div>
  </div>
)}

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
  addToCart: (
    id: string,
    slug: string,
    name: string,
    price: number,
    mainImage: string
  ) => void;
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
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const breakpoint = useBreakpoint();

  const slugForLang = product.slug.en || "";
  const nameForLang = product.name?.[currentLang] || product.name?.en || "";
  const thumbnail = product.thumbnails?.[0];
  const hasThumbnail = Boolean(thumbnail);

  return (
    <div
      className="relative group flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setHoveredIcon(null);
      }}
    >
      <Link href={`/products/${slugForLang}?lang=${currentLang}`}>
        <div className="w-full aspect-square relative overflow-hidden mt-3">
          <div className="absolute top-2 left-0 bg-white text-xs font-semibold text-black px-2 py-3 rounded shadow z-10">
            {extractModel(product.name[currentLang] || product.name.en)}
          </div>

          {/* Main Image - hidden on hover if thumbnail exists */}
          <Image
            src={product.mainImage}
            alt={nameForLang}
            fill
            unoptimized
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              hovered && hasThumbnail ? "hidden" : "block"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />

          {/* Show single thumbnail on hover if available */}
          {hovered && hasThumbnail && (
            <Image
              src={thumbnail!}
              alt={`${nameForLang} thumbnail`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          {/* If hovered but no thumbnail, show mainImage again */}
          {hovered && !hasThumbnail && (
            <Image
              src={product.mainImage}
              alt={nameForLang}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          {/* Large screens: show icons on hover */}
          {(breakpoint === "md" || breakpoint === "lg") && hovered && (
            <div className="absolute top-3 right-1 flex flex-col space-y-3 z-10">
              {/* Search Icon */}
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredIcon("search")}
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
                {hoveredIcon === "search" && (
                  <span
                    className="absolute right-full mr-2 md:mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100"
                    style={{ minWidth: "80px" }}
                  >
                    Quick view
                  </span>
                )}
              </div>
              {/* Heart Icon */}
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredIcon("wishlist")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <button
                  aria-label={translatedTexts.addtoWishlist}
                  className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
                  onClick={(e) => {
                    e.preventDefault();
                    addToWishlist();
                  }}
                >
                  <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
                </button>
                {hoveredIcon === "wishlist" && (
                  <span
                    className="absolute top-0 -translate-y-full mb-2 left-1/4 -translate-x-1/2 md:top-1/2 md:right-full md:mr-3 md:left-auto md:translate-y-[-50%] md:translate-x-0 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100 z-20"
                    style={{ minWidth: "110px" }}
                  >
                    {translatedTexts.addtoWishlist}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Medium screens: always show both icons */}
          {breakpoint === "md" && (
            <div className="absolute top-3 right-1 flex flex-col space-y-3 z-10">
               <button
      aria-label="Quick view"
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mb-2"
      onClick={(e) => {
        e.preventDefault();
        setQuickViewProduct(product);
      }}
    >
      <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
    </button>
              <button
                aria-label={translatedTexts.addtoWishlist}
                className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
                onClick={(e) => {
                  e.preventDefault();
                  addToWishlist();
                }}
              >
                <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          )}

          {/* Small screens: always show only heart icon */}
          {breakpoint === "sm" && (
            <div className="absolute top-3 right-1 flex flex-col space-y-3 z-10">
              <button
                aria-label={translatedTexts.addtoWishlist}
                className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 w-10 h-10 mt-5"
                onClick={(e) => {
                  e.preventDefault();
                  addToWishlist();
                }}
              >
                <FiHeart className="text-gray-900 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-6 text-center flex flex-col flex-grow">
        <Link href={`/products/${slugForLang}?lang=${currentLang}`}>
          <h3 className="text-lg font-semibold hover:underline min-h-[3.5rem] leading-tight">
            {nameForLang}
          </h3>
        </Link>
        <p className="text-gray-600 mt-1">
          {symbol}
          {product.price}
        </p>

        <div
          className="mt-2 relative group"
          onMouseEnter={() => setHoveredIcon("cart")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <button
            className="w-full bg-blue-800 border border-black text-white px-4 py-1 rounded shadow-sm flex items-center justify-center transition-colors duration-200 hover:bg-black"
            onClick={() =>
              addToCart(
                product.id,
                slugForLang,
                nameForLang,
                product.price,
                product.mainImage
              )
            }
          >
            {hoveredIcon === "cart" ? (
              <FiShoppingCart className="w-5 h-5" />
            ) : (
              <span className="text-sm">{translatedTexts.addtoCart}</span>
            )}
          </button>
          {hoveredIcon === "cart" && (
            <span
              className="absolute top-0 -translate-y-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs font-medium transition-all duration-200 opacity-100 scale-100"
              style={{ minWidth: "80px" }}
            >
              {translatedTexts.addtoCart}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
