"use client";

import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { FiEye, FiHeart, FiX } from "react-icons/fi";
import Image from "next/image";
import parse, { domToReact, HTMLReactParserOptions, Element as DomElement, DOMNode } from "html-react-parser";

import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";

import ReviewForm from "./ReviewForm";
import ReviewList, { useReviewCount } from "./ReviewList";
import RelatedProducts from "./RelatedProduct";
import ProductMetaInfo from "@/app/components/ProductMetaInfo";
import { translations } from "@/app/translations/translations";

const parseOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if ((domNode as DomElement).type === "tag" && (domNode as DomElement).name === "a") {
      const element = domNode as DomElement;
      const href = element.attribs?.href;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {domToReact(element.children as unknown as DOMNode[], parseOptions)}
        </a>
      );
    }
    return undefined;
  },
};

interface Product {
  _id: string;
  name: Record<string, string>;
  slug: Record<string, string>;
  price: number;
  description: Record<string, string>;
  Specifications: Record<string, string>;
  Shipping: Record<string, string>;
  Warranty: Record<string, string>;
  mainImage: string;
  thumbnails: string[];
  sku: string;
  category: string;
  brand: string;
}

interface ProductDetailsPageProps {
  product: Product;
  lang: string;
}

// ...existing code...
const stripHtmlToParagraphs = (html: string): string[] => {
  if (!html) return [];
  // Match <p> and <li> blocks, fallback to plain text if none found
  const matches = html.match(/<(p|li)[^>]*>(.*?)<\/(p|li)>/gi);
  if (matches && matches.length > 0) {
    return matches
      .map((tag) => tag.replace(/<[^>]+>/g, "").trim())
      .filter((text, idx, arr) => text && arr.indexOf(text) === idx);
  }
  // Fallback: strip all tags and return as a single paragraph
  const fallback = html.replace(/<[^>]+>/g, "").trim();
  return fallback ? [fallback] : [];
};
// ...existing code...

  

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, lang }) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(true);
  const [showReviewList, setShowReviewList] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const [viewers, setViewers] = useState(80);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainSectionRef = useRef<HTMLDivElement>(null);

  const { addToCart, openCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { language } = useLanguage();
  const { symbol } = useCurrency();

  const reviewCount = useReviewCount(product.slug[language] || product.slug.en);

  const t = translations[language as keyof typeof translations]; // ✅ type-safe

  useEffect(() => setTotalPrice(product.price * quantity), [quantity, product.price]);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1,0,+1
        let next = prev + change;
        if (next < 30) next = 30;
        if (next > 100) next = 100;
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (!mainSectionRef.current) return;
      const rect = mainSectionRef.current.getBoundingClientRect();
      // Show sticky bar if main section is scrolled out of view (top < -100)
      setShowStickyBar(rect.top < -100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    const slug = product.slug[language] || product.slug.en;
    const name = product.name[language] || product.name.en;
    addToCart({ slug, name, price: product.price, mainImage: product.mainImage, quantity }, language);
    openCart();
  };

  const handleAddToWishlist = () => {
    const slug = product.slug[language] || product.slug.en;
    addToWishlist(slug, language);
  };

  const toggleReviews = () => {
    setShowReviewList(!showReviewList);
    setShowReviewForm(!showReviewForm);
    setShowDescription(showReviewList);
  };

  const showProductDescription = () => {
    setShowDescription(true);
    setShowReviewList(false);
    setShowReviewForm(false);
  };

  const toggleSpecifications = () => {
    setShowSpecifications(!showSpecifications);
    setShowDescription(showSpecifications);
    setShowReviewList(false);
    setShowReviewForm(false);
  };

  const toggleShipping = () => {
    setShowShipping(!showShipping);
    setShowDescription(showShipping);
    setShowReviewList(false);
    setShowReviewForm(false);
  };

  const toggleWarranty = () => {
    setShowWarranty(!showWarranty);
    setShowDescription(showWarranty);
    setShowReviewList(false);
    setShowReviewForm(false);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name[lang] || product.name.en,
              image: [product.mainImage, ...product.thumbnails],
              description: product.description[lang] || product.description.en,
              sku: product._id,
              offers: {
                "@type": "Offer",
                url: `https://www.drivecoreauto.com/product/${product.slug[lang] || product.slug.en}`,
                priceCurrency: "USD",
                price: product.price,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </Head>

      <section ref={mainSectionRef} className="max-w-6xl mx-auto px-4 py-10 mt-20 lg:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Images */}
          <div className="w-full md:w-1/2">
            <div
              className={`relative rounded-lg cursor-zoom-in overflow-hidden transition-transform duration-500 ease-in-out md:scale-95 md:hover:scale-110 ${
                isModalOpen ? "scale-100 md:scale-100 md:hover:scale-100" : ""
              }`}
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src={product.thumbnails[selectedThumbnail] || product.mainImage}
                alt={product.name[language] || product.name.en}
                width={500}
                height={500}
                className="rounded-lg"
                unoptimized
              />
            </div>

            <div className="flex gap-4 mt-4">
              {[product.mainImage, ...product.thumbnails].map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedThumbnail(idx)}
                  className={`cursor-pointer ${selectedThumbnail === idx ? "border-2 border-blue-500" : ""}`}
                >
                  <Image src={thumb} alt={`Thumbnail ${idx + 1}`} width={100} height={100} className="rounded-lg" unoptimized />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2">
            <nav className="inline-block text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li>
                  <a href={`/?lang=${language}`} className="text-blue-600 hover:underline">
                    {t.home}
                  </a>
                </li>
                <li>/</li>
                <li className="text-gray-900 truncate max-w-[200px]">{product.name[language] || product.name.en}</li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold text-gray-900">{product.name[language] || product.name.en}</h1>
            <p className="text-gray-600 mt-1 font-semibold">{symbol}{totalPrice.toFixed(2)}</p>

            <div className="border-t border-gray-300 my-4" />

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-4">
              <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className="bg-transparent border border-gray-300 text-xl px-4 py-2 rounded-full">-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="bg-transparent border border-gray-300 text-xl px-4 py-2 rounded-full">+</button>
            </div>

            <button className="bg-black text-white py-3 mt-4 w-full rounded-md" onClick={handleAddToCart}>
              {t.addToCart}
            </button>

            <button className="mt-3 w-full flex items-center justify-center gap-2 text-blue-600 font-semibold border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition" onClick={handleAddToWishlist}>
              <FiHeart className="w-5 h-5" />
              <span>{t.addToWishlist}</span>
            </button>

            <div className="flex items-center justify-center gap-2 mt-2 text-gray-600 text-sm font-medium select-none">
              <FiEye className="w-5 h-5 text-gray-500" />
              <span>
                {viewers} {viewers === 1 ? t.personWatching : t.peopleWatching} {t.productDescription.toLowerCase()}!
              </span>
            </div>

            <ProductMetaInfo sku={product.sku} category={product.category} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-9 flex flex-col gap-4 md:gap-6">
          {/* Description */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${showDescription ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"}`}
              onClick={showProductDescription}
            >
              {t.productDescription}
            </span>
            {showDescription && <div className="space-y-2 mt-2">{stripHtmlToParagraphs(product.description[language] || product.description.en).map((p, idx) => <p key={idx}>{p}</p>)}</div>}
          </div>

          {/* Specifications */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${showSpecifications ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"}`}
              onClick={toggleSpecifications}
            >
              {t.specifications}
            </span>
            {showSpecifications && <div className="space-y-2 mt-2">{stripHtmlToParagraphs(product.Specifications[language] || product.Specifications.en).map((p, idx) => <p key={idx}>{p}</p>)}</div>}
          </div>

          {/* Shipping */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${showShipping ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"}`}
              onClick={toggleShipping}
            >
              {t.shipping}
            </span>
            {showShipping && <div className="space-y-2 mt-2">{stripHtmlToParagraphs(product.Shipping[language] || product.Shipping.en).map((p, idx) => <p key={idx}>{p}</p>)}</div>}
          </div>

          {/* Warranty */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${showWarranty ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"}`}
              onClick={toggleWarranty}
            >
              {t.warranty}
            </span>
            {showWarranty && <div className="space-y-2 mt-2">{stripHtmlToParagraphs(product.Warranty[language] || product.Warranty.en).map((p, idx) => <p key={idx}>{p}</p>)}</div>}
          </div>

          {/* Reviews */}
          <div>
<span
  className={`text-lg font-semibold cursor-pointer ${
    showReviewList ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
  }`}
  onClick={toggleReviews}
>
  {t.reviews} (
  <span className="text-yellow-500">{reviewCount}</span>
  )
</span>

            {showReviewList && <ReviewList productSlug={product.slug[language] || product.slug.en} />}
      {showReviewForm && (
  <ReviewForm
    slug={product.slug[language] || product.slug.en}
    productName={product.name[language] || product.name.en}
  />
)}


          </div>
        </div>

        {/* Related Products */}
        <div className="mt-10">
          <RelatedProducts currentProductSlug={product.slug[language] || product.slug.en} />

        </div>
      </section>

       {/* Sticky Bottom Bar (only on md+ screens) */}
      {showStickyBar && (
        <div className="hidden md:flex fixed bottom-0 left-0 w-full bg-white shadow-lg border-t z-50 py-3 px-6 items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4">
            <img
              src={product.mainImage}
              alt={product.name[language] || product.name.en}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <div className="font-semibold text-lg ">{product.name[language] || product.name.en}</div>
              <div className="text-gray-700 font-bold">{symbol}{product.price.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
  <button
    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
    className="bg-transparent border border-gray-300 text-xl px-3 py-1 rounded-full"
    aria-label="Decrease quantity"
  >
    -
  </button>
  <span className="min-w-[24px] text-center">{quantity}</span>
  <button
    onClick={() => setQuantity(quantity + 1)}
    className="bg-transparent border border-gray-300 text-xl px-3 py-1 rounded-full"
    aria-label="Increase quantity"
  >
    +
  </button>
</div>
          <div className="flex items-center gap-2">
            <button
              className="bg-black text-white px-5 py-2 rounded-md font-semibold"
              onClick={handleAddToCart}
            >
              {t.addToCart}
            </button>
            <button
              className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition"
              onClick={handleAddToWishlist}
            >
              <FiHeart className="w-5 h-5" />
              <span>{t.addToWishlist}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailsPage;
