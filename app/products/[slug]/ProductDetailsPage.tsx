"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FiEye, FiHeart } from "react-icons/fi";
import Image from "next/image";
import ReviewForm from "./ReviewForm";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import ReviewList from "./ReviewList";
import { useLanguage } from "@/app/context/LanguageContext";
import  ProductMetaInfo  from "@/app/components/ProductMetaInfo";
import { FiX } from "react-icons/fi";
import { useCurrency } from "@/app/context/CurrencyContext";
import Link from "next/link";
import RelatedProducts from "./RelatedProduct";

import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element as DomElement,
  DOMNode,
} from "html-react-parser";


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
   // ✅ Add these two new fields
  sku: string;
  category: string;
  brand: string;
}

interface Props {
  product: Product;
}

const stripHtmlToParagraphs = (html: string): string[] => {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = doc.querySelectorAll("p, li");

  const seen = new Set<string>();
  const result: string[] = [];

  elements.forEach((el) => {
    const text = el.textContent?.trim();
    if (text && !seen.has(text)) {
      seen.add(text);
      result.push(text);
    }
  });

  const fallback = doc.body.textContent?.trim() || "";
  if (result.length === 0 && fallback && !seen.has(fallback)) {
    result.push(fallback);
  }

  return result;
};




const ProductDetailsPage: React.FC<Props> = ({ product }) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);

  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(true);
  const [showReviewList, setShowReviewList] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const { addToCart, openCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [viewers, setViewers] = useState(80);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { symbol } = useCurrency();
  

  const { language } = useLanguage();

  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        slug: product.slug?.[language] || product.slug?.en || "",
        name: product.name?.[language] || product.name?.en || "",
        price: product.price.toString(),
        mainImage: product.mainImage,
        quantity,
      });
      openCart();
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist({
        _id: product._id,
        name: product.name?.[language] || product.name?.en || "",
        price: product.price.toString(),
        mainImage: product.mainImage,
        slug: product.slug?.[language] || product.slug?.en || "",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prevCount) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        let next = prevCount + change;
        if (next < 30) next = 30;
        if (next > 100) next = 100;
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleReviews = () => {
    if (!showReviewList && !showReviewForm) {
      setShowReviewList(true);
      setShowReviewForm(true);
      setShowDescription(false);
    } else {
      setShowReviewList(false);
      setShowReviewForm(false);
      setShowDescription(true);
    }
  };

  const showProductDescription = () => {
    setShowDescription(true);
    setShowReviewList(false);
    setShowReviewForm(false);
  };

  const toggleSpecifications = () => {
    if (!showSpecifications) {
      setShowSpecifications(true);
      setShowDescription(false);
      setShowReviewList(false);
      setShowReviewForm(false);
      setShowShipping(false);
      setShowWarranty(false);
    } else {
      setShowSpecifications(false);
      setShowDescription(true);
    }
  };

  const toggleShipping = () => {
    if (!showShipping) {
      setShowShipping(true);
      setShowDescription(false);
      setShowReviewList(false);
      setShowReviewForm(false);
      setShowSpecifications(false);
      setShowWarranty(false);
    } else {
      setShowShipping(false);
      setShowDescription(true);
    }
  };

  const toggleWarranty = () => {
    if (!showWarranty) {
      setShowWarranty(true);
      setShowDescription(false);
      setShowReviewList(false);
      setShowReviewForm(false);
      setShowSpecifications(false);
      setShowShipping(false);
    } else {
      setShowWarranty(false);
      setShowDescription(true);
    }
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
              name: product.name,
              image: [product.mainImage, ...product.thumbnails],
              description: product.description,
              sku: product.slug,
              offers: {
                "@type": "Offer",
                url: `https://yourdomain.com/product/${product.slug}`,
                priceCurrency: "USD",
                price: product.price,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        ></script>
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-10 mt-20 lg:mt-40">

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Main Image and Thumbnails */}
          <div className="w-full md:w-1/2">
   <div
  className={`relative rounded-lg cursor-zoom-in overflow-hidden transition-transform duration-500 ease-in-out
    md:scale-95 md:hover:scale-110
    ${isModalOpen ? "scale-100 md:scale-100 md:hover:scale-100" : ""}
  `}
  onClick={() => setIsModalOpen(true)}
>
  <Image
    src={product.thumbnails[selectedThumbnail] || product.mainImage}
    alt={product.name?.[language] || product.name?.en || ""}
    width={500}
    height={500}
    className="rounded-lg"
  />
</div>


  {/* Thumbnails */}
  <div className="flex gap-4 mt-4">
    {[product.mainImage, ...product.thumbnails].map((thumb: string, index: number) => (
      <div
        key={index}
        onClick={() => setSelectedThumbnail(index)}
        className={`cursor-pointer ${
          selectedThumbnail === index ? "border-2 border-blue-500" : ""
        }`}
      >
        <Image
          src={thumb}
          alt={`Thumbnail ${index + 1}`}
          width={100}
          height={100}
          className="rounded-lg"
        />
      </div>
    ))}
  </div>
</div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2">
           <div className="w-full md:w-1/2 ">
  <nav
    className="inline-block text-sm text-gray-600 mb-4"
    aria-label="Breadcrumb"
  >
    <ol className="inline-flex items-center space-x-1 md:space-x-2">
      <li>
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
      </li>
      <li>/</li>
      
      <li>/</li>
      <li className="text-gray-900 truncate max-w-[200px]">
        {product.name?.[language] || product.name?.en || ""}
      </li>
    </ol>
  </nav>
</div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {product.name?.[language] || product.name?.en || ""}
            </h1>

             <p className="text-gray-600 mt-1">{symbol}{product.price}</p>

            <div className="border-t border-gray-300 my-4"></div>

            

            <div className="  my-4"></div>

            {/* Quantity Control */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="bg-transparent border border-gray-300 text-xl px-4 py-2 rounded-full"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-transparent border border-gray-300 text-xl px-4 py-2 rounded-full"
              >
                +
              </button>
            </div>

            <button
              className="bg-black text-white py-3 mt-4 w-full rounded-md"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            {/* Add to Wishlist Button with Heart Icon */}
            <button
              className="mt-3 w-full flex items-center justify-center gap-2 text-blue-600 font-semibold border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition"
              onClick={handleAddToWishlist}
            >
              <FiHeart className="w-5 h-5" />
              <span>Add to Wishlist</span>
            </button>

            {/* People watching count with Eye Icon */}
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-600 text-sm font-medium select-none">
              <FiEye className="w-5 h-5 text-gray-500" />
              <span>
                {viewers} {viewers === 1 ? "person" : "people"} watching this product now!
              </span>
            </div>
            <ProductMetaInfo sku={product.sku} category={product.category} />

          </div>
        </div>

        {/* Product Description and Reviews Section */}
        <div className="mt-9 flex flex-col gap-4 md:gap-6">
         
          {/* Product Description */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${
                showDescription ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
              }`}
              onClick={showProductDescription}
            >
              Product Description
            </span>
           {showDescription && (
  <div className="space-y-2">
    {parse(product.description?.[language] || product.description?.en || "", parseOptions)}
  </div>
)}


          </div>

          {/* Specifications */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${
                showSpecifications ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
              }`}
              onClick={toggleSpecifications}
            >
              Specifications
            </span>
            {showSpecifications &&
              stripHtmlToParagraphs(product.Specifications?.[language] || product.Specifications?.en || "No specifications available.").map((para, idx) => (
                <p
    key={idx}
    className="before:content-['•'] before:text-black before:mr-2 before:font-bold"
  >
    {para}
  </p>
              ))}
          </div>

          {/* Shipping & Delivery */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${
                showShipping ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
              }`}
              onClick={toggleShipping}
            >
              Shipping & Delivery
            </span>
            {showShipping &&
              stripHtmlToParagraphs(product.Shipping?.[language] || product.Shipping?.en || "Shipping & delivery information is not available.").map((para, idx) => (
                <p key={idx} className="mb-2 mt-2 ">
                  {para}
                </p>
              ))}
          </div>


          {/* Warranty */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${
                showWarranty ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
              }`}
              onClick={toggleWarranty}
            >
              Warranty
            </span>
            {showWarranty &&
              stripHtmlToParagraphs(product.Warranty?.[language] || product.Warranty?.en || "Warranty details are not available.").map((para, idx) => (
                <p key={idx} className="mb-2 mt-2">
                  {para}
                </p>
              ))}
          </div>

          {/* Reviews */}
          <div>
            <span
              className={`text-lg font-semibold cursor-pointer ${
                showReviewList || showReviewForm ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
              }`}
              onClick={toggleReviews}
            >
              Reviews
            </span>
            {(showReviewList || showReviewForm) && (
              <div className="mt-2">
                {showReviewList && <ReviewList productSlug={product.slug?.[language] || product.slug?.en || ""} />}
                {showReviewForm && (
                  <ReviewForm productName={product.name?.[language] || product.name?.en || ""} slug={product.slug?.[language] || product.slug?.en || ""} />
                )}
              </div>
            )}
          </div>
        </div>
        <RelatedProducts currentProductSlug={product.slug?.[language] || product.slug?.en || ""} />

      </section>
      {/* Modal Popup */}
    {isModalOpen && (
      <div
        className="fixed inset-0  bg-opacity-70 flex items-center justify-center z-50"
        onClick={() => setIsModalOpen(false)} // Close when clicking outside image
      >
        <div
          className="relative bg-white rounded p-4 max-w-[90vw] max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal content
        >
          <button
            className="absolute top-2 right-2 text-gray-700 hover:text-black"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close image preview"
          >
            <FiX size={24} />
          </button>
          <Image
            src={product.thumbnails[selectedThumbnail] || product.mainImage}
            alt={product.name?.[language] || product.name?.en || ""}
            width={800}
            height={800}
            className="rounded"
          />
        </div>
      </div>
    )}
    </>
  );
};

export default ProductDetailsPage;









      