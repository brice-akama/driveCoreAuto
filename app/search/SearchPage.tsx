'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { FaHeart } from 'react-icons/fa';
import QuickViewModal from "../components/QuickViewModal";
import { useCurrency } from "@/app/context/CurrencyContext";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";



// Unified Product type
interface Product {
  slug: { [lang: string]: string }; // always object for TS safety
  name: { [lang: string]: string };
  mainImage: string; // Required, no `?`
  _id: string;
  subText?: string;
  price: number; // now always number
  category: string;
  releaseDate?: string;
  description: { [lang: string]: string };
  Specifications: Record<string, string>;
  Shipping: Record<string, string>;
  Warranty: Record<string, string>;
}

const SORT_OPTIONS = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'priceAsc', label: 'Price: Low to High' },
  { key: 'priceDesc', label: 'Price: High to Low' },
  { key: 'newest', label: 'Newest' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const { language: currentLang } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [results, setResults] = useState<{ products: Product[]; blogs: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [engineCode, setEngineCode] = useState('');
  const [engineCodeList, setEngineCodeList] = useState<string[]>([]);
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { symbol } = useCurrency();
  const router = useRouter();


  const { addToWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  // Adjust items per page on resize
  useEffect(() => {
    function updateItemsPerPage() {
      setItemsPerPage(window.innerWidth < 640 ? 6 : 12);
    }
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Fetch search results
  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

   


    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?search=${encodeURIComponent(query)}&lang=${currentLang}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // Normalize products for TS safety
        const normalizedProducts: Product[] = data.products.map((p: any) => ({
          slug: typeof p.slug === 'string' ? { en: p.slug } : p.slug,
          name: p.name,
          mainImage: p.mainImage || "/placeholder.jpg",
          _id: p._id,
          subText: p.subText || '',
          price: p.price ?? 0,
          category: p.category,
          releaseDate: p.releaseDate,
          description: p.description || {},
          Specifications: p.Specifications || {},
          Shipping: p.Shipping || {},
          Warranty: p.Warranty || {},
        }));

        setResults({ products: normalizedProducts, blogs: data.blogs || [] });
        setCurrentPage(1);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentLang]);

  // Extract engine codes
  useEffect(() => {
    if (results?.products) {
      const codes = Array.from(new Set(results.products.map(p => p.category))).filter(Boolean) as string[];
      setEngineCodeList(codes);
    }
  }, [results]);

  // Add to cart
  const handleAddToCart = (product: Product) => {
    const slug = product.slug[currentLang] || product.slug.en;
    const name = product.name[currentLang] || product.name.en;

    addToCart(
  {
    slug,
    name,
    price: product.price,
    mainImage: product.mainImage || '',
    quantity: 1,
  },
  currentLang
);

    openCart();
  };
  
  // Inside your SearchPage component, after router is defined
const handleViewDetails = (product: Product) => {
  const englishSlug = product.slug.en; // always use English slug
  router.push(`/products/${englishSlug}?lang=${currentLang}`);
};


  // Add to wishlist
  const handleAddToWishlist = (product: Product) => {
    const slug = product.slug[currentLang] || product.slug.en;
    addToWishlist(slug, currentLang);
  };

  if (loading) return <div className="p-6">Loading search results...</div>;
  if (!results) return <div className="p-6">No results found for "{query}"</div>;

  // Filter & sort
  let filteredProducts = results.products;
  if (engineCode.trim() !== '') {
    filteredProducts = filteredProducts.filter(
      p => p.category?.toLowerCase() === engineCode.toLowerCase()
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc': return a.price - b.price;
      case 'priceDesc': return b.price - a.price;
      case 'newest': return (new Date(b.releaseDate || '')).getTime() - (new Date(a.releaseDate || '')).getTime();
      default: return 0;
    }
  });

  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
     <>
     <Head>
  <title>Search results for: {query} | DriveCore Auto</title>
  <meta
    name="description"
    content={`Showing search results for "${query}" on DriveCore Auto.`}
  />
</Head>

     {/* Breadcrumb Section with black background */}
   {/* Full-width Breadcrumb */}
    <div className="bg-black w-full text-white text-center font-bold text-lg mt-40">
      <div className="py-10 flex items-center justify-center text-sm space-x-2">
        <Link href="/" className="hover:underline font-extrabold">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:underline font-extrabold">Shop</Link>
        <span>/</span>
        <span className="font-extrabold">Search results for: {query}</span>
      </div>
    </div>

    {/* Main content container */}
    <div className="max-w-7xl mx-auto p-6 ">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-6 gap-4">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>

        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Filter by Engine Code"
            value={engineCode}
            onChange={e => { setEngineCode(e.target.value); setCurrentPage(1); setShowEngineDropdown(true); }}
            onFocus={() => setShowEngineDropdown(true)}
            onBlur={() => setTimeout(() => setShowEngineDropdown(false), 200)}
            className="border rounded px-3 py-2 w-full"
            autoComplete="off"
          />
          {showEngineDropdown && engineCodeList.length > 0 && (
            <ul className="absolute z-50 bg-white border border-gray-300 rounded shadow mt-1 max-h-48 overflow-auto w-full text-sm">
              {engineCodeList.filter(c => c.toLowerCase().includes(engineCode.toLowerCase()))
                .map(code => (
                  <li
                    key={code}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => { setEngineCode(code); setShowEngineDropdown(false); }}
                  >
                    {code}
                  </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Products */}
      {totalProducts > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {paginatedProducts.map(product => {
    const slugForLang = product.slug[currentLang] || product.slug.en;
    const nameForLang = product.name[currentLang] || product.name.en;

    return (
      <motion.li
        key={product._id}
        className="relative border rounded p-4 group cursor-pointer bg-white"
        whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Image with hover zoom */}
        <motion.div className="relative overflow-hidden rounded-md">
  <motion.img
    src={product.mainImage || "/placeholder.jpg"}
    alt={nameForLang}
    className="w-full h-48 object-cover cursor-pointer"
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.4 }}
    onClick={() => handleViewDetails(product)} // uses English slug
  />

  {/* Wishlist + Quick View Buttons */}
  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="relative group/item">
      <button
        onClick={() => handleAddToWishlist(product)}
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 flex items-center justify-center"
      >
        <FaHeart size={18} className="text-black" />
      </button>
      <span className="absolute top-1/2 -translate-y-1/2 right-full mr-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
        Add to Wishlist
      </span>
    </div>

    <div className="relative group/item">
      <button
        onClick={() => setQuickViewProduct(product)}
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 flex items-center justify-center"
      >
        🔍
      </button>
      <span className="absolute top-1/2 -translate-y-1/2 right-full mr-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
        Quick View
      </span>
    </div>
  </div>
</motion.div>

{/* Product Name */}
<span
  className="font-semibold hover:underline block mt-3 cursor-pointer"
  onClick={() => handleViewDetails(product)} // uses English slug
>
  {nameForLang}
</span>

        <p className="text-sm text-gray-600">{product.subText}</p>
        <p className="text-gray-600 font-bold mt-1 text-center">{symbol}{product.price}</p>

        {/* Animated Add to Cart */}
        <motion.button
          onClick={() => handleAddToCart(product)}
          className="w-full border border-gray-700 rounded py-2 bg-blue-800 text-white flex items-center justify-center relative overflow-hidden mt-3"
          whileHover={{ scale: 1.05 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="font-medium"
            >
              Add to Cart
            </motion.span>

            {/* Replace text with icon on hover */}
            <motion.div
              key="icon"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </motion.li>
    );
  })}
</ul>

          {quickViewProduct && (
            <QuickViewModal
              product={quickViewProduct}
              currentLang={currentLang}
              onClose={() => setQuickViewProduct(null)}
              handleAddToCart={handleAddToCart}
              handleAddToWishlist={handleAddToWishlist}
              translatedTexts={{ addtoCart: 'Add to Cart', addToWishlist: 'Add to Wishlist' }}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              <button
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-3">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Blogs */}
      {results.blogs.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-12 mb-4">Blogs</h2>
          <ul>
            {results.blogs.map(blog => (
              <li key={typeof blog.slug === 'string' ? blog.slug : blog.slug.en} className="mb-4">
                <h3 className="font-semibold">{blog.title?.[currentLang] || blog.title?.en}</h3>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
    </>
  );
}
