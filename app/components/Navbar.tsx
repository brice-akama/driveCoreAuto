'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaUser, FaBars, FaTimes, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";
import SelectLanguageButton from "./SelectLanguageButton";


type SubMenuItem = {
  name: string;
  link: string;
  subMenu?: SubMenuItem[];
};

interface ProductResult {
  name: string;
  slug: string;
  category?: string;
}

interface BlogResult {
  title: string;
  slug: string;
}

type MenuItem = {
  name: string;
  link: string;
  subLinks?: (SubMenuItem | string)[];
  customDropdownType?: "category" | "default" | "transmissionCategory";
};

type Mode = "top" | "categoryList" | "supportList" |  "swapList" | "transmissionsList" | { subIndex: number };

const Navbar = () => {
  const { translate } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [translatedMenuItems, setTranslatedMenuItems] = useState<MenuItem[]>([]);
  const { openCart } = useCart();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search...");
  const [mode, setMode] = useState<Mode>("top");
  const [expandedTransmissionIndex, setExpandedTransmissionIndex] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
const [popupSearchQuery, setPopupSearchQuery] = useState("");
const { language } = useLanguage();
const [dropdownResults, setDropdownResults] = useState<{
  products: ProductResult[];
  blogs: BlogResult[];
}>({ products: [], blogs: [] });





  const [translatedTexts, setTranslatedTexts] = useState({
    login: '',
    specialOffer: '',
    aquaBite: '',
    shopNow: ''
  });

  const toSlug = (text: string): string => {
    const baseSlug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const exceptions = ['vape pods', 'vape cartridges'];
    if (exceptions.includes(text.toLowerCase().trim())) {
      return `-${baseSlug}`;
    }
    return baseSlug;
  };

  useEffect(() => {
  if (!searchQuery.trim()) {
    setDropdownResults({ products: [], blogs: [] });
    return;
  }

  const timer = setTimeout(async () => {
    const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery)}&lang=${language}`);
    const data = await res.json();
    setDropdownResults({ products: data.products, blogs: data.blogs });
  }, 300); // wait 300ms before calling API

  return () => clearTimeout(timer); // cleanup previous timer
}, [searchQuery, language]);

  // Fetch translations and menu items on mount
  useEffect(() => {
    async function fetchTranslations() {
      const items: MenuItem[] = [
        {
          name: await translate("ENGINES"),
          link: "/toyota",
          customDropdownType: "category",
          subLinks: [
            {
              name: await translate("Toyota Engines"),
              link: "/toyota",
              subMenu: [
                { name: await translate("2GR-FKS"), link: `/toyota?category=${toSlug("2GR-FKS")}` },
                { name: await translate("2TR-FE"), link: `/toyota?category=${toSlug("2TR-FE")}` },
                { name: await translate("1ZZ-FE"), link: `/toyota?category=${toSlug("1ZZ-FE")}` },
                { name: await translate("2ZR-FXE"), link: `/toyota?category=${toSlug("2ZR-FXE")}` },
                { name: await translate("2AZ-FE"), link: `/toyota?category=${toSlug("2AZ-FE")}` },
                { name: await translate("5VZ-FE"), link: `/toyota?category=${toSlug("5VZ-FE")}` },
                { name: await translate("1MZ-FE"), link: `/toyota?category=${toSlug("1MZ-FE")}` },
                { name: await translate("2GR-FE"), link: `/toyota?category=${toSlug("2GR-FE")}` },
              ],
            },
            
           {
  name: await translate("Subaru Engines"),
  link: "/subaru",
  subMenu: [
    { name: await translate("EJ20"), link: `/subaru?category=${toSlug("EJ20")}` },
    { name: await translate("EJ25"), link: `/subaru?category=${toSlug("EJ25")}` },
    { name: await translate("FB20"), link: `/subaru?category=${toSlug("FB20")}` },
    { name: await translate("FA20"), link: `/subaru?category=${toSlug("FA20")}` },
    { name: await translate("EZ36"), link: `/subaru?category=${toSlug("EZ36")}` },
    { name: await translate("EJ205"), link: `/subaru?category=${toSlug("EJ205")}` },
  ],
},
{
  name: await translate("Acura  Engines"),
  link: "/acura",
  subMenu: [
    { name: await translate("K20A"), link: `/acura?category=${toSlug("K20A")}` },
    { name: await translate("K24A"), link: `/acura?category=${toSlug("K24A")}` },
    { name: await translate("B18C"), link: `/acura?category=${toSlug("B18C")}` },
    { name: await translate("H22A"), link: `/acura?category=${toSlug("H22A")}` },
    { name: await translate("J37A1"), link: `/acura?category=${toSlug("J37A1")}` },
    { name: await translate("F22B"), link: `/acura?category=${toSlug("F22B")}` },
    { name: await translate("F23A"), link: `/acura?category=${toSlug("F23A")}` },
    { name: await translate("B20B"), link: `/acura?category=${toSlug("B20B")}` },
  ],
},

             {
  name: await translate("Infiniti  Engines"),
  link: "/infiniti",
  subMenu: [
    { name: await translate("VQ35DE"), link: `/infiniti?category=${toSlug("VQ35DE")}` },
    { name: await translate("VK56DE"), link: `/infiniti?category=${toSlug("VK56DE")}` },
    { name: await translate("VQ40DE"), link: `/infiniti?category=${toSlug("VQ40DE")}` },
    { name: await translate("VQ25HR"), link: `/infiniti?category=${toSlug("VQ25HR")}` },
    { name: await translate("VQ37VHR"), link: `/infiniti?category=${toSlug("VQ37VHR")}` },
    { name: await translate("QR25DE"), link: `/infiniti?category=${toSlug("QR25DE")}` },
    { name: await translate("VK45DE"), link: `/infiniti?category=${toSlug("VK45DE")}` },
    { name: await translate("VR38DETT"), link: `/infiniti?category=${toSlug("VR38DETT")}` },
  ],
},

           {
  name: await translate("Scion  Engines"),
  link: "/scion",
  subMenu: [
    { name: await translate("2ZR-FE"), link: `/scion?category=${toSlug("2ZR-FE")}` },
    { name: await translate("1NZ-FE"), link: `/scion?category=${toSlug("1NZ-FE")}` },
    { name: await translate("2AZ-FE"), link: `/scion?category=${toSlug("2AZ-FE")}` },
    { name: await translate("1GR-FE"), link: `/scion?category=${toSlug("1GR-FE")}` },
    { name: await translate("3ZR-FAE"), link: `/scion?category=${toSlug("3ZR-FAE")}` },
    { name: await translate("5E-FE"), link: `/scion?category=${toSlug("5E-FE")}` },
  ],
},


            {
  name: await translate("Nissan  Engines"),
  link: "/nissan",
  subMenu: [
    { name: await translate("QR20DE"), link: `/nissan?category=${toSlug("QR20DE")}` },
    { name: await translate("QR25DE"), link: `/nissan?category=${toSlug("QR25DE")}` },
    { name: await translate("VQ35DE"), link: `/nissan?category=${toSlug("VQ35DE")}` },
    { name: await translate("HR15DE"), link: `/nissan?category=${toSlug("HR15DE")}` },
    { name: await translate("MR18DE"), link: `/nissan?category=${toSlug("MR18DE")}` },
    { name: await translate("YD25DDTi"), link: `/nissan?category=${toSlug("YD25DDTi")}` },
    { name: await translate("GA16DE"), link: `/nissan?category=${toSlug("GA16DE")}` },
    { name: await translate("VQ35HR"), link: `/nissan?category=${toSlug("VQ35HR")}` },
  ],
},   

           {
  name: await translate("Honda  Engines"),
  link: "/honda",
  subMenu: [
    { name: await translate("K20A"), link: `/honda?category=${toSlug("K20A")}` },
    { name: await translate("K24A"), link: `/honda?category=${toSlug("K24A")}` },
    { name: await translate("R18A"), link: `/honda?category=${toSlug("R18A")}` },
    { name: await translate("L15B"), link: `/honda?category=${toSlug("L15B")}` },
    { name: await translate("B18C"), link: `/honda?category=${toSlug("B18C")}` },
  ],
},
{
  name: await translate("Lexus  Engines"),
  link: "/lexus",
  subMenu: [
    { name: await translate("ES 250"), link: `/lexus?category=${toSlug("ES-250")}` },
    { name: await translate("ES 350"), link: `/lexus?category=${toSlug("ES-350")}` },
    { name: await translate("RX 350h"), link: `/lexus?category=${toSlug("RX-350h")}` },
    { name: await translate("NX 350h"), link: `/lexus?category=${toSlug("NX-350h")}` },
      { name: await translate("1MZ-FE"), link: `/lexus?category=${toSlug("1MZ-FE")}` },
    // Add others as you get more data
  ],
},  
          ],
        },

        
      
      {
  name: await translate("TRANSMISSION"),  // plural sounds better here
    link: "/transmissions/toyota/automatic",
  customDropdownType: "transmissionCategory",
  subLinks: [
    {
      name: await translate("Toyota Transmissions"),
       link: "/transmissions/toyota/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/toyota/automatic",
          subMenu: [
            { name: "U660E", link: `/transmissions/toyota?model=${toSlug("U660E")}` },
            { name: "A245E", link: `/transmissions/toyota?model=${toSlug("A245E")}` }
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/toyota/manual",
          subMenu: [
            { name: "E351", link: `/transmissions/toyota?model=${toSlug("E351")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Honda Transmissions"),
       link: "/transmissions/honda/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/honda/automatic",
          subMenu: [
            { name: "BAXA", link: `/transmissions/honda?model=${toSlug("BAXA")}` }
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/honda/manual",
          subMenu: [
            { name: "M24A", link: `/transmissions/honda?model=${toSlug("M24A")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Nissan Transmissions"),
      link: "/transmissions/nissan/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/nissan/automatic",
          subMenu: [
            { name: "RE4F04B", link: `/transmissions/nissan?model=${toSlug("RE4F04B")}` }
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/nissan/manual",
          subMenu: [
            { name: "FS5W71C", link: `/transmissions/nissan?model=${toSlug("FS5W71C")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Subaru Transmissions"),
     link: "/transmissions/subaru/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/subaru/automatic",
          subMenu: [
            { name: "ModelA1", link: `/transmissions/subaru?model=${toSlug("ModelA1")}` },
            { name: "ModelA2", link: `/transmissions/subaru?model=${toSlug("ModelA2")}` },
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/subaru/manual",
          subMenu: [
            { name: "ModelM1", link: `/transmissions/subaru?model=${toSlug("ModelM1")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Acura Transmissions"),
      link: "/transmissions/acura/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/acura/automatic",
          subMenu: [
            { name: "ModelA1", link: `/transmissions/acura?model=${toSlug("ModelA1")}` }
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/acura/manual",
          subMenu: [
            { name: "ModelM1", link: `/transmissions/acura?model=${toSlug("ModelM1")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Infiniti Transmissions"),
       link: "/transmissions/infiniti/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/infiniti/automatic",
          subMenu: [
            { name: "ModelA1", link: `/transmissions/infiniti?model=${toSlug("ModelA1")}` }
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/infiniti/manual",
          subMenu: [
            { name: "ModelM1", link: `/transmissions/infiniti?model=${toSlug("ModelM1")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Scion Transmissions"),
       link: "/transmissions/scion/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/scion/automatic",
          subMenu: [
            { name: "ModelA1", link: `/transmissions/scion?model=${toSlug("ModelA1")}` }
          ]
        },
        {
          name: await translate("Manual"),
          link: "/transmissions/scion/manual",
          subMenu: [
            { name: "ModelM1", link: `/transmissions/scion?model=${toSlug("ModelM1")}` }
          ]
        }
      ]
    },
    {
      name: await translate("Lexus Transmissions"),
      link: "/transmissions/lexus/automatic",
      subMenu: [
        {
          name: await translate("Automatic"),
          link: "/transmissions/lexus/automatic",
          subMenu: [
            { name: "ModelA1", link: `/transmissions/lexus?model=${toSlug("ModelA1")}` }
          ]
        },
        
      ]
    },
   
  ]
},

{
  name: await translate("SWAPS"),
  link: "/swaps/toyota",
  subLinks: [
    { name: await translate("Toyota Swaps"), link: "/swaps/toyota" },
    { name: await translate("Nissan Swaps"), link: "/swaps/nissan" },
    { name: await translate("Honda Swaps"), link: "/swaps/honda" },
    
    { name: await translate("Subaru Swaps"), link: "/swaps/subaru" },
    
    { name: await translate("Infiniti Swaps"), link: "/swaps/infiniti" },
  ]
},


       { name: await translate("ABOUT US"), link: "/about-us" },
        { name: await translate("BLOG"), link: "/blog" },
        
        {
          name: await translate("SUPPORT"), link: "/support",
          subLinks: [
            { name: await translate("FAQS"), link: "/support/faqs" },
            { name: await translate("Contact Us"), link: "/support/contact-us" },
            { name: await translate("Buyer Services"), link: "/support/buyer-services" },
           
          ]
        },

        
        
      ];
      setTranslatedMenuItems(items);

      const aquaBite = await translate("16Zips");
      const login = await translate("Login");
      const shopNow = await translate("Shop Now");
      const specialOffer = await translate("Quality You Can Trust");
      setTranslatedTexts({ aquaBite, login, specialOffer, shopNow });
    }

    fetchTranslations().catch(console.error);
  }, [translate]);

  const knownPaths = ["/privacy-policy", "/terms", "/support", "/about-us", "/refund-policy", "/shipping-info", "/faqs", "/contact-us"];

  // LIVE SEARCH
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDropdownResults({ products: [], blogs: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery)}&lang=${language}`);
        const data = await res.json();
        setDropdownResults({ products: data.products, blogs: data.blogs });
      } catch (error) {
        console.error(error);
        setDropdownResults({ products: [], blogs: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, language]);

  // STATIC SEARCH (button click)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const matchedPath = knownPaths.find(path => path.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    if (matchedPath) {
      router.push(matchedPath);
      setSearchQuery('');
      return;
    }

    try {
      const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery)}&lang=${language}`);
      const { products, blogs } = await res.json();

      if (products.length || blogs.length) {
        if (products.length) router.push(`/products/${products[0].slug}?lang=${language}`);
        else if (blogs.length) router.push(`/blog/${blogs[0].slug}?lang=${language}`);

        setSearchQuery('');
        setDropdownResults({ products: [], blogs: [] });
      } else {
        toast.error("No matching results found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };




  const handleDropdownEnter = (index: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 350);
    setHoverTimeout(timeout);
  };

  const doPopupSearch = () => {
  if (!popupSearchQuery.trim()) return;

  (async () => {
    try {
      const knownPaths = ["/privacy-policy", "/terms", "/support", "/about-us", "/refund-policy", "/shipping-info", "/faqs", "/contact-us"];
      const matchedPath = knownPaths.find(path => path.toLowerCase().includes(popupSearchQuery.trim().toLowerCase()));
      if (matchedPath) {
        router.push(matchedPath);
      } else {
        const res = await fetch(`/api/search?search=${encodeURIComponent(popupSearchQuery.trim())}`);
        const { redirectTo } = await res.json();
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          toast.error("No matching results found.");
        }
      }
    } catch (error) {
      console.error("Error during search:", error);
      toast.error("Something went wrong. Please try again.");
    }
  })();

  setIsSearchOpen(false);
  setPopupSearchQuery("");
};

  const goBack = () => {
    if (mode === "categoryList" || mode === "supportList" || mode === "transmissionsList") setMode("top");
    else setMode("categoryList");
  };

 // ...existing code...
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 1024); // was 768
  window.addEventListener("resize", handleResize);
  handleResize();
  return () => window.removeEventListener("resize", handleResize);
}, []);
// ...existing code...

  useEffect(() => {
    async function fetchPlaceholderTranslation() {
      const placeholder = await translate("Search...");
      setSearchPlaceholder(placeholder || "Search...");
    }
    fetchPlaceholderTranslation().catch(console.error);
  }, [translate]);

  useEffect(() => {
  setExpandedTransmissionIndex(null);
}, [mode]);


  return (
    <div className="w-full fixed top-0 z-20 left-0">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Moving Text Bar */}
      {/* Top Bar (responsive layout) */}
    <div className="absolute top-0 left-0 w-full bg-blue-100 h-10 flex items-center justify-between px-6 md:px-16 z-50">

  {/* Left side - Special Offer */}
  <div className="w-full md:w-auto flex justify-center md:justify-start">
    <p className="text-black text-sm font-semibold flex items-center gap-2">
      {translatedTexts.specialOffer}
      <Link
        href="/toyota"
        className="text-blue-600 font-bold underline hover:text-blue-800 transition"
      >
        {translatedTexts.shopNow}
      </Link>
    </p>
  </div>

  {/* Right side - Warranty & Track Order */}
  <div className="hidden md:flex items-center gap-6">
    <Link
      href={`/${language}/warranty`}
      className="text-sm font-bold text-black hover:text-blue-900 uppercase transition"
    >
      Warranty
    </Link>
  <Link
  href={`/${language}/shipping`}
  className="text-sm font-bold text-black hover:text-blue-900 uppercase transition"
>
  Shipping
</Link>

    <Link
      href="/track-order"
      className="text-sm font-bold text-black hover:text-blue-900 uppercase transition"
    >
      Track Order
    </Link>
  </div>
</div>

      {/* Secondary Navbar */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center h-20 mt-8">
        <div className="flex items-center space-x-4 bg-transparent">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-lg">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          <Link href={`/?lang=${language}`}className="hidden md:block mt-4 bg-transparent">
            <Image src="/assets/logo.png" alt="logo" width={180} height={80} className="object-contain bg-transparent " />
          </Link>

          <div className="md:hidden w-full">
            <Link href={`/?lang=${language}`} className="block bg-transparent">
              <Image src="/assets/logo.png" alt="logo" width={140} height={30} className="object-contain bg-transparent" />
            </Link>
          </div>
        </div>

        <div className="items-center w-1/2 bg-gray-50 rounded-full shadow-inner px-6 py-3 mx-auto mt-3 hidden md:flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-grow bg-transparent outline-none text-gray-800 text-lg"
          />
          <button onClick={handleSearch} className="flex-shrink-0 ml-3">
            <FaSearch className="text-gray-500 text-xl" />
          </button>
          {/* Dropdown */}
        {(dropdownResults.products.length || dropdownResults.blogs.length) > 0 && (
          <div className="search-dropdown absolute bg-white border mt-1 w-full z-50">
            {dropdownResults.products.map((product) => (
              <div
                key={product.slug}
                className="dropdown-item cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => {
                  router.push(`/products/${product.slug}?lang=${language}`);
                  setDropdownResults({ products: [], blogs: [] });
                  setSearchQuery('');
                }}
              >
                {product.name}
              </div>
            ))}

            {dropdownResults.blogs.map((blog) => (
              <div
                key={blog.slug}
                className="dropdown-item cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => {
                  router.push(`/blog/${blog.slug}?lang=${language}`);
                  setDropdownResults({ products: [], blogs: [] });
                  setSearchQuery('');
                }}
              >
                {blog.title}
              </div>
            ))}
          </div>
        )}

        </div>

        <div className="flex items-center space-x-2 ">
          <button
  onClick={() => {
    setIsSearchOpen(true);
    setPopupSearchQuery("");
  }}
  aria-label="Open search"
  className="text-2xl cursor-pointer text-black hover:text-blue-700 mt-3 md:hidden "
>
  <FaSearch />
</button>

          <Link href="/wishlist" className="relative">
            <FaHeart className="text-2xl cursor-pointer text-black hover:text-red-700 mt-3" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-3">{wishlist.length}</span>
          </Link>
          <Link href="/profile">
            <FaUser className="text-2xl cursor-pointer hidden md:block mt-3" />
          </Link>
          <div className="relative">
            <FaShoppingCart className="cursor-pointer hover:text-gray-400 text-2xl mt-3" onClick={openCart} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-3">{cartCount}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar and Sidebar */}
      {!isMobile ? (
        <div className="bg-white shadow-md py-3 px-6">
          <div className="flex justify-start space-x-6 relative">
            {translatedMenuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(index)}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="cursor-pointer uppercase mt-2 flex items-center gap-1 rounded-md transition" onClick={() => item.subLinks && setActiveDropdown(index)}>
                  <Link href={item.link}>{item.name}</Link>
                  {item.subLinks && (activeDropdown === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>

                {item.subLinks && activeDropdown === index && (
                  <div className="absolute left-0 top-full mt-3 bg-white border border-gray-200 shadow-lg py-2 w-52 z-10">
                    {item.subLinks.map((sub, subIndex) => {
                      const isSubWithMenu = typeof sub === "object" && Array.isArray(sub.subMenu);
                      const label = typeof sub === "string" ? sub : sub.name;
                      const submenu = isSubWithMenu ? sub.subMenu! : [];

                      return (
                        <div key={subIndex} className="group relative">
                          <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                            {!isSubWithMenu ? (
                              <Link href={(typeof sub === "object" ? sub.link : `${item.link}/${toSlug(label)}`)} className="block w-full">{label}</Link>
                            ) : (
                              <Link href={sub.link} className="block w-full">{label}</Link>
                            )}
                            {isSubWithMenu && <span className="ml-2">&gt;</span>}
                          </div>

                          {isSubWithMenu && submenu.length > 0 && (
                            <div className="absolute top-0 left-full bg-white border border-gray-200 shadow-lg w-44 ml-0 hidden group-hover:block z-20">
                              {submenu.map(({ name, link }, i) => (
                                <Link key={i} href={link} className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer whitespace-nowrap">{name}</Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <SelectLanguageButton />
          </div>
        </div>
      ) : null}

      {/* Sidebar for mobile */}
      {isSidebarOpen && isMobile && (
        <div
    className="fixed inset-0 z-30  bg-opacity-40"
    onClick={() => setIsSidebarOpen(false)}
  >
    <div
      className="fixed left-0 top-0 h-full w-64 bg-white z-40 shadow-lg"
      onClick={e => e.stopPropagation()}
    >
      {/* X icon always at top-right */}
      <div className="flex justify-end items-center p-4 border-b border-gray-200">
        <button
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
          className="flex items-center gap-2 text-2xl text-black hover:text-red-600 transition mt-8"
        >
          <FaTimes />
          <span className="text-base font-semibold">Close</span>
        </button>
      </div>

      {/* Search input below Close button */}
<div className="relative w-full border-gray-200">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search..."
    className="w-full py-2 pl-4 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
  />
  <button
    onClick={() => {
      handleSearch();
      setIsSidebarOpen(false);
    }}
    className="absolute right-0 top-0 bottom-0 bg-blue-800 w-12 flex items-center justify-center rounded-r-md"
  >
    <FaSearch className="text-white text-lg" />
  </button>
</div>


      

            {/* Sidebar Menu */}
            <div className="flex flex-col space-y-4 p-4">
              {mode === "top" && (
                <>
                  {translatedMenuItems.map((item, idx) => {
                    const commonClasses = "w-full text-lg text-left py-3 px-2 flex justify-between items-center border-b border-gray-200";

                    if (item.customDropdownType === "category") {
                      return (
                        <button key={idx} onClick={() => setMode("categoryList")} className={commonClasses}>
                          {item.name} <ChevronRight />
                        </button>
                      );
                    }

                    if (item.customDropdownType === "transmissionCategory") {
                      return (
                        <button key={idx} onClick={() => setMode("transmissionsList")} className={commonClasses}>
                          {item.name} <ChevronRight />
                        </button>
                      );
                    }

                    if (item.link === "/support") {
                      return (
                        <button key={idx} onClick={() => setMode("supportList")} className={commonClasses}>
                          {item.name} <ChevronRight />
                        </button>
                      );
                    }

                    if (item.link === "/swaps/toyota") {
                      return (
                        <button key={idx} onClick={() => setMode("swapList")} className={commonClasses}>
                          {item.name} <ChevronRight />
                        </button>
                      );
                    }


                    return (
                      <Link key={idx} href={item.link} onClick={() => setIsSidebarOpen(false)} className={`${commonClasses} block border-b border-gray-200`}>
                        {item.name}
                      </Link>
                    );
                  })}
                </>
              )}

              {/* Engines submenu */}
              {mode === "categoryList" && (
                <div>
                  <button onClick={goBack} className="mb-4 flex items-center gap-2 text-lg">
                    <FaTimes /> Back
                  </button>
                  {translatedMenuItems
                    .find(it => it.customDropdownType === "category")
                    ?.subLinks?.map((cat: any, i: number) => (
                      <button key={i} onClick={() => setMode({ subIndex: i })} className="flex justify-between items-center w-full py-2 px-2 text-lg border-b border-gray-200">
                        {cat.name} <ChevronRight />
                      </button>
                    ))}
                </div>
              )}

              {/* Engines submenu inner */}
              {typeof mode === "object" && (
                <div>
                  <button onClick={goBack} className="mb-4 flex items-center gap-2 text-lg">
                    <FaTimes /> Back
                  </button>
                  {(() => {
                    const categoryItem = translatedMenuItems.find(it => it.customDropdownType === "category");
                    if (!categoryItem) return null;

                    // Filter to only object type subLinks with subMenu arrays
                    const validSubLinks = (categoryItem.subLinks ?? []).filter(sub => typeof sub === "object" && sub !== null && "subMenu" in sub && Array.isArray(sub.subMenu)) as SubMenuItem[];
                    const cat = validSubLinks[mode.subIndex];
                    if (!cat) return null;

                    return (
                      <>
                        <h3 className="font-bold mb-2">{cat.name}</h3>
                        <ul>
                          {cat.subMenu?.map(sub => (
                            <li key={sub.name} className="py-2">
                              <Link href={sub.link} onClick={() => setIsSidebarOpen(false)}>{sub.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Support submenu */}
              {mode === "supportList" && (
                <div>
                  <button onClick={goBack} className="mb-4 flex items-center gap-2 text-lg">
                    <FaTimes /> Back
                  </button>
                  {translatedMenuItems
                    .find(item => item.link === "/support")
                    ?.subLinks?.map(sub => {
                      if (typeof sub === "string") {
                        return (
                          <Link key={sub} href={`/support/${toSlug(sub)}`} onClick={() => setIsSidebarOpen(false)} className="block ml-4 py-2 border-b border-gray-200 hover:text-black">
                            {sub}
                          </Link>
                        );
                      } else {
                        return (
                          <Link key={sub.name} href={sub.link} onClick={() => setIsSidebarOpen(false)} className="block ml-4 py-2 border-b border-gray-200 hover:text-black">
                            {sub.name}
                          </Link>
                        );
                      }
                    })}
                </div>
              )}

              {/* Swap submenu */}
              {mode === "swapList" && (
                <div>
                  <button onClick={goBack} className="mb-4 flex items-center gap-2 text-lg">
                    <FaTimes /> Back
                  </button>
                  {translatedMenuItems
                    .find(item => item.link ===  "/swaps/toyota",)
                    ?.subLinks?.map(sub => {
                      if (typeof sub === "string") {
                        return (
                          <Link key={sub} href={`/swaps/${toSlug(sub)}`} onClick={() => setIsSidebarOpen(false)} className="block ml-4 py-2 border-b border-gray-200 hover:text-black">
                            {sub}
                          </Link>
                        );
                      } else {
                        return (
                          <Link key={sub.name} href={sub.link} onClick={() => setIsSidebarOpen(false)} className="block ml-4 py-2 border-b border-gray-200 hover:text-black">
                            {sub.name}
                          </Link>
                        );
                      }
                    })}
                </div>
              )}

              {/* Transmissions submenu */}
              

{mode === "transmissionsList" && (
  <div>
    <button onClick={goBack} className="mb-4 flex items-center gap-2 text-lg">
      <FaTimes /> Back
    </button>

    {translatedMenuItems
      .find(item => item.customDropdownType === "transmissionCategory")
      ?.subLinks?.map((manufacturer, idx) => {
        if (typeof manufacturer === "string") {
          return (
            <Link
              key={manufacturer}
              href={`/transmissions/${toSlug(manufacturer)}`}
              onClick={() => setIsSidebarOpen(false)}
              className="block ml-4 py-2 border-b border-gray-200 hover:text-black"
            >
              {manufacturer}
            </Link>
          );
        }

        const isExpanded = expandedTransmissionIndex === idx;

        return (
          <div key={manufacturer.name} className="mb-2">
            <button
              onClick={() => setExpandedTransmissionIndex(isExpanded ? null : idx)}
              className="flex justify-between items-center w-full py-2 px-2 text-lg border-b border-gray-200 hover:bg-gray-100"
              aria-expanded={isExpanded}
              aria-controls={`transmission-submenu-${idx}`}
            >
              <span>{manufacturer.name}</span>
              <ChevronRight
                className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : "rotate-0"}`}
                aria-hidden="true"
              />
            </button>

            {isExpanded && manufacturer.subMenu && (
              <ul
                id={`transmission-submenu-${idx}`}
                className="ml-6 border-l border-gray-300"
              >
                {manufacturer.subMenu.map((transmissionType) => (
                  // Show only Manual and Automatic as clickable links
                  <li key={transmissionType.name} className="py-2">
                    <Link
                      href={transmissionType.link}
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-blue-600 hover:underline block"
                    >
                      {transmissionType.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
  </div>
)}


              <Link
                onClick={() => setIsSidebarOpen(false)}
                href="/profile"
                className="ml-3 text-lg !text-black hover:!text-red-800 upper-case"
              >
                {translatedTexts.login}
              </Link>
            </div>
          </div>
        </div>
      )}

      


{isSearchOpen && (
  <div
    className="fixed inset-0 bg-opacity-50 flex items-start mt-25 justify-center z-50 p-4"
    onClick={() => setIsSearchOpen(false)} // Clicking outside popup closes it
  >
    <div
      className="bg-white p-6 rounded-lg w-full max-w-md relative"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
    >
      {/* Close button at top-right */}
      <button
        onClick={() => setIsSearchOpen(false)}
        aria-label="Close search"
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition text-xl"
      >
        <FaTimes />
      </button>

      <div className="flex space-x-2 items-center mt-6">
        <input
          type="text"
          value={popupSearchQuery}
          onChange={(e) => setPopupSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          autoFocus
          className="flex-grow border border-gray-300 rounded px-4 py-2 text-lg outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              doPopupSearch();
            }
          }}
        />
        <button
          onClick={doPopupSearch}
          className="bg-blue-600 text-white px-1 py-2 rounded hover:bg-blue-700 transition"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Navbar;
