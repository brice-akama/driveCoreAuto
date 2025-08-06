'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useWishlist } from "@/app/context/WishlistContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";

type Product = {
  id: string;
  name: Record<string, string>;
  price: number;
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  slug: Record<string, string>;
};

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

  const handleAddToWishlist = (
    id: string,
    slug: string,
    name: string,
    price: number,
    mainImage: string
  ) => {
    addToWishlist({ _id: id, name, price: price.toString(), mainImage, slug });
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
            addToWishlist={handleAddToWishlist}
            translatedTexts={translatedTexts}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  currentLang,
  addToWishlist,
  translatedTexts,
}: {
  product: Product;
  currentLang: string;
  addToWishlist: (
    id: string,
    slug: string,
    name: string,
    price: number,
    mainImage: string
  ) => void;
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

  const slugForLang = product.slug?.[currentLang] || product.slug?.en || "";
  const nameForLang = product.name?.[currentLang] || product.name?.en || "";

  return (
    <div
      className="relative group flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setHoveredIcon(null);
      }}
    >
      <Link href={`/products/${slugForLang}`}>
        <div className="w-full aspect-square relative overflow-hidden mt-3">
          <div className="absolute top-2 left-0 bg-white text-xs font-semibold text-black px-2 py-3 rounded shadow z-10">
            {extractModel(product.name[currentLang] || product.name.en)}
          </div>

          <Image
            src={product.mainImage}
            alt={nameForLang}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />

          {/* Large screens: show icons on hover */}
          {breakpoint === "lg" && hovered && (
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
                  onClick={e => {
                    e.preventDefault();
                    alert(`Open quick view for ${nameForLang}`);
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
                  onClick={e => {
                    e.preventDefault();
                    addToWishlist(
                      product.id,
                      slugForLang,
                      nameForLang,
                      product.price,
                      product.mainImage
                    );
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
                onClick={e => {
                  e.preventDefault();
                  alert(`Open quick view for ${nameForLang}`);
                }}
              >
                <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                aria-label={translatedTexts.addtoWishlist}
                className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
                onClick={e => {
                  e.preventDefault();
                  addToWishlist(
                    product.id,
                    slugForLang,
                    nameForLang,
                    product.price,
                    product.mainImage
                  );
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
                className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 w-10 h-10"
                onClick={e => {
                  e.preventDefault();
                  addToWishlist(
                    product.id,
                    slugForLang,
                    nameForLang,
                    product.price,
                    product.mainImage
                  );
                }}
              >
                <FiHeart className="text-gray-900 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-6 text-center flex flex-col flex-grow">
        <Link href={`/products/${slugForLang}`}>
          <h3 className="text-lg font-semibold hover:underline min-h-[3.5rem] leading-tight">
            {nameForLang}
          </h3>
        </Link>
        <p className="text-gray-600 mt-1">{symbol}{product.price}</p>

        <div
          className="mt-2 relative group"
          onMouseEnter={() => setHoveredIcon("cart")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <button
            className="w-full bg-blue-800 border border-black text-white px-4 py-1 rounded shadow-sm flex items-center justify-center transition-colors duration-200 hover:bg-black"
            onClick={() =>
              addToWishlist(
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