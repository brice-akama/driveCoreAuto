



'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { Menu, X } from "lucide-react"
import BrandLinksNav from "@/app/components/BrandLinksNav";
import { FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import { useCurrency } from "@/app/context/CurrencyContext";


type Product = {
  _id: string;
  name: Record<string, string>;
  slug: Record<string, string>;
  price: number;
  mainImage: string;
  category: string;
};

const toSlug = (text: string) => text.toUpperCase().replace(/\s+/g, "-");

export default function TransmissionsNissanManualPage() {
  const { language, translate } = useLanguage();
  const currentLang = language || "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsRef = useRef<HTMLDivElement>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
   const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { symbol } = useCurrency();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>([]);
  const [vehicleModels, setVehicleModels] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [appliedPriceRange, setAppliedPriceRange] = useState<string | null>(null);


  // Controlled input values
  const [vehicleModelInput, setVehicleModelInput] = useState("");
  const [engineCodeInput, setEngineCodeInput] = useState("");

  // Applied filters (only updated on APPLY clicks)
  const [appliedVehicleModel, setAppliedVehicleModel] = useState<string | null>(
    null
  );
  const [appliedEngineCode, setAppliedEngineCode] = useState<string | null>(
    null
  );

  const updateUrl = (vehicleModel?: string | null, engineCode?: string | null) => {
  const params = new URLSearchParams();

  params.set("transmissionNissanburaManuel", "true"); // keep this always

  if (engineCode && engineCode.trim() !== "") {
    params.set("category", engineCode.trim().toUpperCase());
  } else {
    params.delete("category");
  }

  if (vehicleModel && vehicleModel.trim() !== "") {
    params.set("vehicleModel", vehicleModel.trim());
  } else {
    params.delete("vehicleModel");
  }

 
  router.push(`/transmissions/nissan/manual?${params.toString()}`);
};


  // Suggestion dropdown visibility
  const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);
  const [showEngineSuggestions, setShowEngineSuggestions] = useState(false);

  const { addToWishlist } = useWishlist();

  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
 const productsPerPage = isMobile ? 6 : 12;




  const [translatedTexts, setTranslatedTexts] = useState({
    addToCart: "Add to Cart",
    addToWishList: "Add to Wishlist",
      home: " Home",
      toyota: "Transmissions Nissan Manual",
      engineCodes: "Engine Codes",
       vehicleModel: "VEHICLE MODEL",
         sortedBy: "Sort By",
          sortPriceLowToHigh: "Price: Low to High",
          sortPriceHighToLow: "Price: High to Low",
          placeholderVehicleModel: "Enter your vehicle model",
            placeholderEngineCode: "Enter your engine code",
         
  });

 

  // Fetch button translations
  useEffect(() => {
  async function fetchTranslations() {
    try {
      const addToCart = await translate("Add to Cart");
      const toyota = await translate("Transmissions Nissan Manual");
      const engineCodes = await translate("Engine Codes");
      const addToWishList = await translate("Add to Wishlist");
      const home = await translate("Home");
      const vehicleModel = await translate("VEHICLE MODEL");
      const sortedBy = await translate("Sort By");
      const sortPriceLowToHigh = await translate("Price: Low to High");
      const sortPriceHighToLow = await translate("Price: High to Low");
      const placeholderVehicleModel = await translate("Enter your vehicle model");
      const placeholderEngineCode = await translate("Enter your engine code");

      setTranslatedTexts({
        addToCart: addToCart || "Add to Cart",
        addToWishList: addToWishList || "Add to Wishlist",
        home: home || "Home",
        toyota: toyota || "Transmissions Nissan Manual",
        engineCodes: engineCodes || "Engine Codes",
        vehicleModel: vehicleModel || "VEHICLE MODEL",
        sortedBy: sortedBy || "Sort By",
        sortPriceLowToHigh: sortPriceLowToHigh || "Price: Low to High",
        sortPriceHighToLow: sortPriceHighToLow || "Price: High to Low",
        placeholderVehicleModel: placeholderVehicleModel || "Enter your vehicle model",
        placeholderEngineCode: placeholderEngineCode || "Enter your engine code",
      });
    } catch {
      setTranslatedTexts({
        addToCart: "Add to Cart",
        addToWishList: "Add to Wishlist",
        home: "Home",
        toyota: "Transmissions Nissan Manual",
        engineCodes: "Engine Codes",
        vehicleModel: "VEHICLE MODEL",
        sortedBy: "Sort By",
        sortPriceLowToHigh: "Price: Low to High",
        sortPriceHighToLow: "Price: High to Low",
        placeholderVehicleModel: "Enter your vehicle model",
        placeholderEngineCode: "Enter your engine code",
      });
    }
  }

  fetchTranslations();
}, [language, translate]);

  useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 640); // Tailwind's "sm" is 640px

  checkMobile(); // Initial check

  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);


  // Fetch product data for categories and vehicle models on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products?transmissionNissanburaManuel=true");
        const data = await res.json();
        const productList: Product[] = data.data || [];

        // Unique engine codes (categories)
        const uniqueCategories = Array.from(
          new Set(productList.map((p) => p.category))
        ).sort();

        // Unique vehicle models from product names: extract first word after "Toyota"
        const modelsSet = new Set<string>();
        productList.forEach((p) => {
          const name = p.name[currentLang] || p.name.en || "";
          const match = name.match(/Transmissions Nissan Automatic\s+(\w+)/i);
          if (match && match[1]) {
            modelsSet.add(match[1]);
          }
        });
        const uniqueModels = Array.from(modelsSet).sort();

        setCategories(uniqueCategories);
        setVehicleModels(uniqueModels);
      } catch (e) {
        console.error("Failed to fetch data for filters", e);
        setCategories([]);
        setVehicleModels([]);
      }
    })();
  }, [currentLang]);

  // Fetch filtered products when applied filters change
  useEffect(() => {
    (async () => {
      setLoading(true);
      let apiUrl = "/api/products?transmissionNissanburaManuel=true";

      if (appliedVehicleModel && appliedVehicleModel.trim() !== "") {
        apiUrl += `&vehicleModel=${encodeURIComponent(appliedVehicleModel.trim())}`;
      }
      if (appliedEngineCode && appliedEngineCode.trim() !== "") {
        apiUrl += `&engineCode=${encodeURIComponent(appliedEngineCode.trim())}`;
      }

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
        setCurrentPage(1);
      } catch (e) {
        console.error("Failed to fetch filtered products", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [appliedVehicleModel, appliedEngineCode]);

  // Scroll top on page change
  useEffect(() => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  // Filter products by price first
let filteredProducts = [...products];

if (appliedPriceRange === "750-1500") {
  filteredProducts = filteredProducts.filter(p => p.price >= 750 && p.price <= 1500);
} else if (appliedPriceRange === "1500-2250") {
  filteredProducts = filteredProducts.filter(p => p.price > 1500 && p.price <= 2250);
} else if (appliedPriceRange === "2250plus") {
  filteredProducts = filteredProducts.filter(p => p.price > 2250);
}
else if (appliedPriceRange === "0-500") {
  filteredProducts = filteredProducts.filter(p => p.price >= 0 && p.price <= 500);
} else if (appliedPriceRange === "500-1000") {
  filteredProducts = filteredProducts.filter(p => p.price > 500 && p.price <= 1000);
} else if (appliedPriceRange === "1000-1400") {
  filteredProducts = filteredProducts.filter(p => p.price > 1000 && p.price <= 1400);
}
// Sort products per selected option
const sortedProducts = [...filteredProducts];
if (sortOption === "priceLowToHigh")
  sortedProducts.sort((a, b) => a.price - b.price);
else if (sortOption === "priceHighToLow")
  sortedProducts.sort((a, b) => b.price - a.price);

// Pagination
const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
const currentProducts = sortedProducts.slice(
  (currentPage - 1) * productsPerPage,
  currentPage * productsPerPage
);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Wishlist & Cart
  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      _id: product._id,
      name: product.name[currentLang] || product.name.en || "",
      price: product.price.toString(),
      mainImage: product.mainImage,
      slug: product.slug[currentLang] || product.slug.en || "",
    });
  };

  const handleAddToCart = (product: Product) => {
    console.log(
      `Adding ${product.name[currentLang] || product.name.en} to cart!`
    );
  };

 // Brand list to detect in product names
const BRANDS = ["Toyota", "Nissan", "Subaru", "Honda", "Mazda","Accessories","Scion", "Acura","lexus",];

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

  // Suggestion filters based on input text
  const filteredVehicleModels = vehicleModels.filter((model) =>
    model.toLowerCase().startsWith(vehicleModelInput.toLowerCase())
  );

  const filteredEngineCodes = categories.filter((code) =>
    code.toLowerCase().startsWith(engineCodeInput.toLowerCase())
  );

  // Select suggestion just sets input value & closes suggestions (do not apply filter here)
  const selectVehicleModel = (model: string) => {
  setVehicleModelInput(model);
  setShowMobileFilters(false);
  setAppliedVehicleModel(model);
  setShowVehicleSuggestions(false);

  // Also update URL with both filters
  updateUrl(model, appliedEngineCode);
};




  const selectEngineCode = (code: string) => {
 const slug = code.trim().toUpperCase();
setEngineCodeInput(slug);
router.push(`/transmissions/nissan/manual?category=${slug}`);
setShowMobileFilters(false);

  setShowEngineSuggestions(false);
};

useEffect(() => {
  const categoryParam = searchParams.get("category");
  const vehicleModelParam = searchParams.get("vehicleModel");

  if (categoryParam) {
    setAppliedEngineCode(categoryParam.toUpperCase());
    setEngineCodeInput(categoryParam.toUpperCase());
  }
  if (vehicleModelParam) {
    setAppliedVehicleModel(vehicleModelParam);
    setVehicleModelInput(vehicleModelParam);
  }
}, [searchParams]);

  

  return (

    <>
    <div className=" md:mt-0">
     
  <BrandLinksNav currentBrand="Transmissions Nissan Manual" />
</div>

    <div className="max-w-7xl mx-auto px-4 py-10 ">

      
      
      
      {/* Your Toyota-specific content */}
    
      {/* Breadcrumb */}
      <nav
  className="mt-0 md:mt-10 block md:hidden text-sm text-gray-600"
  aria-label="Breadcrumb"
>

        <ol className="inline-flex items-center space-x-2">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              {translatedTexts.home}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{translatedTexts.toyota}</li>
          {(appliedEngineCode || appliedVehicleModel) && (
            <>
              <li>/</li>
              <li className="text-gray-900 font-medium">
                {appliedVehicleModel ? `Model: ${appliedVehicleModel}` : ""}
                {appliedEngineCode
                  ? ` ${appliedVehicleModel ? " | " : ""}Code: ${appliedEngineCode}`
                  : ""}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Mobile menu button */}
      <div className="sm:hidden mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">   {translatedTexts.engineCodes}</h2>
         <button
    onClick={() => setShowMobileFilters(true)}
    className="p-2 border rounded flex items-center gap-2"
    aria-label="Show sidebar"
  >
    <Menu size={20} />
    <span className="text-sm font-medium">Show sidebar</span>
  </button>
  {showMobileFilters && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-opacity-30 z-40"
      onClick={() => setShowMobileFilters(false)}
    />

    {/* Sidebar */}
    <aside
      className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-lg z-50 flex flex-col p-6 transition-transform duration-300"
      style={{ transform: showMobileFilters ? "translateX(0)" : "translateX(100%)" }}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        onClick={() => setShowMobileFilters(false)}
        aria-label="Close sidebar"
      >
        <X size={24} />
      </button>

      {/* Vehicle Model Input */}
      <div className="mt-8">
        <label htmlFor="vehicleModelInputMobile" className="block font-bold mb-2">
          {translatedTexts.vehicleModel}
        </label>
        <input
  id="vehicleModelInputMobile"
  type="text"
  placeholder={translatedTexts.placeholderVehicleModel}
  value={vehicleModelInput}
  onChange={(e) => {
    setVehicleModelInput(e.target.value);
    setShowVehicleSuggestions(true);
  }}
  onFocus={() => setShowVehicleSuggestions(true)}
  onBlur={() => setTimeout(() => setShowVehicleSuggestions(false), 150)}
  className="w-full border rounded px-3 py-2"
  autoComplete="off"
/>
{showVehicleSuggestions && filteredVehicleModels.length > 0 && (
  <ul className="border border-gray-300 rounded mt-1 max-h-48 overflow-auto bg-white absolute z-50 w-72 shadow-md">
    {filteredVehicleModels.map((model) => (
      <li
        key={model}
        onMouseDown={() => selectVehicleModel(model)}
        className="cursor-pointer px-3 py-1 hover:bg-blue-600 hover:text-white"
      >
        {model}
      </li>
    ))}
  </ul>
)}

      </div>

      {/* Engine Code Input */}
      <div className="mt-6">
        <label htmlFor="engineCodeInputMobile" className="block font-bold mb-2">
          {translatedTexts.engineCodes}
        </label>
        <input
  id="engineCodeInputMobile"
  type="text"
  placeholder={translatedTexts.placeholderEngineCode}
  value={engineCodeInput}
  onChange={(e) => {
    setEngineCodeInput(e.target.value);
    setShowEngineSuggestions(true);
  }}
  onFocus={() => setShowEngineSuggestions(true)}
  onBlur={() => setTimeout(() => setShowEngineSuggestions(false), 150)}
  className="w-full border rounded px-3 py-2"
  autoComplete="off"
/>
{showEngineSuggestions && filteredEngineCodes.length > 0 && (
  <ul className="border border-gray-300 rounded mt-1 max-h-48 overflow-auto bg-white absolute z-50 w-72 shadow-md">
    {filteredEngineCodes.map((code) => (
      <li
        key={code}
        onMouseDown={() => selectEngineCode(code)}
        className="cursor-pointer px-3 py-1 hover:bg-blue-600 hover:text-white"
      >
        {code}
      </li>
    ))}
  </ul>
)}

      </div>

      {/* Filter by Price */}
      <div className="mt-6">
        <label className="block font-bold mb-2">Filter by Price</label>
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition ${!appliedPriceRange ? "bg-blue-100 font-semibold" : ""}`}
              onClick={() => {
  setAppliedPriceRange("750-1500");
  setShowMobileFilters(false);
  productsRef.current?.scrollIntoView({ behavior: "smooth" });
}}

            >
              All
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition ${appliedPriceRange === "0-500" ? "bg-blue-100 font-semibold" : ""}`}
              onClick={() => {
  setAppliedPriceRange("750-1500");
  setShowMobileFilters(false);
  productsRef.current?.scrollIntoView({ behavior: "smooth" });
}}

            >
              $0.00 - $500.00
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition ${appliedPriceRange === "500-1000" ? "bg-blue-100 font-semibold" : ""}`}
              onClick={() => {
  setAppliedPriceRange("750-1500");
  setShowMobileFilters(false);
  productsRef.current?.scrollIntoView({ behavior: "smooth" });
}}

            >
              $500.00 - $1,000.00
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition ${appliedPriceRange === "1000-1400" ? "bg-blue-100 font-semibold" : ""}`}
              onClick={() => {
  setAppliedPriceRange("750-1500");
  setShowMobileFilters(false);
  productsRef.current?.scrollIntoView({ behavior: "smooth" });
}}

            >
              $1,000.00 - $1,400.00
            </button>
          </li>
        </ul>
      </div>
    </aside>
  </>
)}

      </div>

      {/* Breadcrumb for md+ screens */}
<nav
  className="hidden md:flex items-center justify-between  text-sm text-gray-600"
  aria-label="Breadcrumb"
>
  <ol className="inline-flex items-center space-x-2">
    <li>
      <Link href="/" className="text-blue-600 hover:underline">
        {translatedTexts.home}
      </Link>
    </li>
    <li>/</li>
    <li className="text-gray-900 font-medium">{translatedTexts.toyota}</li>
    {(appliedEngineCode || appliedVehicleModel) && (
      <>
        <li>/</li>
        <li className="text-gray-900 font-medium">
          {appliedVehicleModel ? `Model: ${appliedVehicleModel}` : ""}
          {appliedEngineCode
            ? ` ${appliedVehicleModel ? " | " : ""}Code: ${appliedEngineCode}`
            : ""}
        </li>
      </>
    )}
  </ol>
 
</nav>

        

      <div className="flex gap-6">
        {/* Filter inputs sidebar for medium+ */}
        <aside className="hidden sm:flex flex-col w-56 shrink-0 gap-6 relative mt-5">
          {/* Vehicle Model Input */}
          <div>
            <label
              htmlFor="vehicleModelInput"
              className="block font-bold mb-2"
            >
            {translatedTexts.vehicleModel}
            </label>
            <input
              id="vehicleModelInput"
              type="text"
              placeholder={translatedTexts.placeholderVehicleModel}
              value={vehicleModelInput}
              onChange={(e) => {
                setVehicleModelInput(e.target.value);
                setShowVehicleSuggestions(true);
              }}
              onFocus={() => setShowVehicleSuggestions(true)}
              onBlur={() => setTimeout(() => setShowVehicleSuggestions(false), 150)}
              className="w-full border rounded px-3 py-2"
              autoComplete="off"
            />
            {showVehicleSuggestions && filteredVehicleModels.length > 0 && (
              <ul className="border border-gray-300 rounded mt-1 max-h-48 overflow-auto bg-white absolute z-10 w-56 shadow-md">
                {filteredVehicleModels.map((model) => (
                  <li
                    key={model}
                    onMouseDown={() => selectVehicleModel(model)}
                    className="cursor-pointer px-3 py-1 hover:bg-blue-600 hover:text-white"
                  >
                    {model}
                  </li>
                ))}
              </ul>
            )}
            
          </div>

          {/* Engine Code Input */}
          <div>
            <label htmlFor="engineCodeInput" className="block font-bold mt-3">
                {translatedTexts.engineCodes}
            </label>
            <input
              id="engineCodeInput"
              type="text"
              placeholder={translatedTexts.placeholderEngineCode}
              value={engineCodeInput}
              onChange={(e) => {
                setEngineCodeInput(e.target.value);
                setShowEngineSuggestions(true);
              }}
              onFocus={() => setShowEngineSuggestions(true)}
              onBlur={() => setTimeout(() => setShowEngineSuggestions(false), 150)}
              className="w-full border rounded px-3 py-2"
              autoComplete="off"
            />
            {showEngineSuggestions && filteredEngineCodes.length > 0 && (
              <ul className="border border-gray-300 rounded mt-1 max-h-48 overflow-auto bg-white absolute z-10 w-56 shadow-md">
                {filteredEngineCodes.map((code) => (
                  <li
                    key={code}
                    onMouseDown={() => selectEngineCode(code)}
                    className="cursor-pointer px-3 py-1 hover:bg-blue-600 hover:text-white"
                  >
                    {code}
                  </li>
                ))}
              </ul>
            )}
            
          </div>
          {/* Filter by Price */}
<div className="mt-6">
  <label className="block font-bold mb-2">Filter by Price</label>
  <ul className="space-y-2">
    <li>
      <button
        className={`w-full text-left px-3 py-2  hover:bg-blue-50 transition ${!appliedPriceRange ? "bg-blue-100 font-semibold" : ""}`}
        onClick={() => setAppliedPriceRange(null)}
      >
        All
      </button>
    </li>
    <li>
      <button
        className={`w-full text-left px-3 py-2  hover:bg-blue-50 transition ${appliedPriceRange === "750-1500" ? "bg-blue-100 font-semibold" : ""}`}
        onClick={() => setAppliedPriceRange("750-1500")}
      >
         $0.00 - $500.00
      </button>
    </li>
    <li>
      <button
        className={`w-full text-left px-3 py-2  hover:bg-blue-50 transition ${appliedPriceRange === "1500-2250" ? "bg-blue-100 font-semibold" : ""}`}
        onClick={() => setAppliedPriceRange("1500-2250")}
      >
         $500.00 - $1,000.00
      </button>
    </li>
    <li>
      <button
        className={`w-full text-left px-3 py-2  hover:bg-blue-50 transition ${appliedPriceRange === "2250plus" ? "bg-blue-100 font-semibold" : ""}`}
        onClick={() => setAppliedPriceRange("2250plus")}
      >
          $1,000.00+
      </button>
    </li>
  </ul>
</div>
        </aside>

        
   
        {/* Products List */}
        <section className="flex-grow" ref={productsRef}>
          
          {/* Sort by */}
          <div className="flex justify-end mb-4">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-3 py-1"
              aria-label="Sort products"
            >
              <option value="default">     {translatedTexts.sortedBy}</option>
              <option value="priceLowToHigh">{translatedTexts.sortPriceLowToHigh}</option>
  <option value="priceHighToLow">{translatedTexts.sortPriceHighToLow}</option>
            </select>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found for the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg overflow-hidden shadow group relative"
                >
                  <Link href={`/products/${product.slug[currentLang] || product.slug.en}`}>
                    <div className="relative w-full h-48 bg-white">
                      <div className="absolute top-2 left-0 bg-white text-xs font-semibold text-black px-2 py-3 rounded shadow z-10">
                        {extractModel(product.name[currentLang] || product.name.en)}
                      </div>
                      <Image
  src={product.mainImage}
  alt={product.name[currentLang] || product.name.en}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-300"
  unoptimized
/>

{/* Icon buttons on hover */}
{/* Icons Container */}
<div className="absolute top-3 right-1 z-10">
  {/* Large Devices (Hover to show icons) */}
  <div className="hidden lg:flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    {/** Search Icon with Tooltip */}
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHoveredIcon(product._id + "-search")}
      onMouseLeave={() => setHoveredIcon(null)}
    >
      <button
        aria-label="Quick view"
        className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
        onClick={(e) => {
          e.preventDefault();
          alert(`Open quick view for ${product.name[currentLang] || product.name.en}`);
        }}
      >
        <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
      </button>
      {hoveredIcon === product._id + "-search" && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100" style={{ minWidth: "80px" }}>
          Quick view
        </span>
      )}
    </div>

    {/** Heart Icon with Tooltip */}
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHoveredIcon(product._id + "-wishlist")}
      onMouseLeave={() => setHoveredIcon(null)}
    >
      <button
        aria-label={translatedTexts.addToWishList}
        className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
        onClick={(e) => {
          e.preventDefault();
          handleAddToWishlist(product);
        }}
      >
        <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
      </button>
      {hoveredIcon === product._id + "-wishlist" && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white shadow-lg rounded px-2 py-1 text-xs md:text-sm font-medium transition-all duration-200 opacity-100 scale-100" style={{ minWidth: "110px" }}>
          {translatedTexts.addToWishList}
        </span>
      )}
    </div>
  </div>

  {/* Medium Devices - Always Show Both Icons */}
  <div className="hidden md:flex lg:hidden flex-col space-y-3">
    <button
      aria-label="Quick view"
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
      onClick={(e) => {
        e.preventDefault();
        alert(`Open quick view for ${product.name[currentLang] || product.name.en}`);
      }}
    >
      <FiSearch className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
    </button>

    <button
      aria-label={translatedTexts.addToWishList}
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 md:p-3 w-10 h-10 md:w-12 md:h-12"
      onClick={(e) => {
        e.preventDefault();
        handleAddToWishlist(product);
      }}
    >
      <FiHeart className="text-gray-900 w-5 h-5 md:w-6 md:h-6" />
    </button>
  </div>

  {/* Small Devices - Only Show Heart Icon */}
  <div className="flex md:hidden">
    <button
      aria-label={translatedTexts.addToWishList}
      className="bg-white rounded-full shadow-md flex items-center justify-center transition p-2 w-10 h-10"
      onClick={(e) => {
        e.preventDefault();
        handleAddToWishlist(product);
      }}
    >
      <FiHeart className="text-gray-900 w-5 h-5" />
    </button>
  </div>
</div>


                    </div>
                  </Link>

                  <div className="p-4 text-center">
                    <Link href={`/products/${product.slug[currentLang] || product.slug.en}`}>
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {product.name[currentLang] || product.name.en}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{symbol}{product.price}</p>

                    <div
  onMouseEnter={() => setHoveredIcon(product._id + "-cart")}
  onMouseLeave={() => setHoveredIcon(null)}
>
  <button
    onClick={() => handleAddToWishlist(product)}
    className="mt-3 w-full border border-gray-700 rounded py-2 hover:bg-black hover:text-white transition bg-blue-800 text-white flex items-center justify-center"
  >
    {hoveredIcon === product._id + "-cart" ? (
      <FiShoppingCart className="w-5 h-5" />
    ) : (
      translatedTexts.addToCart
    )}
  </button>
</div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
}
