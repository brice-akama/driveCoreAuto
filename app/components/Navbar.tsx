'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaSearch, FaUser, FaBars, FaTimes, FaShoppingCart, FaHeart, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";

// ... (keep all your existing type definitions)
type SubMenuItem = {
  name: string;
  link: string;
  subMenu?: SubMenuItem[];
};

interface ProductResult {
  _id: string;
  name: Record<string, string>;
  slug: string | { en: string };
  category?: string;
  mainImage?: string;
  subText?: string;
  price?: number | string;
}

interface BlogResult {
  _id: string;
  title: Record<string, string>;
  slug: string | { en: string };
}

type MenuItem = {
  name: string;
  link: string;
  subLinks?: (SubMenuItem | string)[];
  customDropdownType?: "category" | "default" | "transmissionCategory";
};

type Mode = "top" | "categoryList" | "supportList" | "swapList" | "transmissionsList" | { subIndex: number };

const Navbar = () => {
  const { translate, language } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [translatedMenuItems, setTranslatedMenuItems] = useState<MenuItem[]>([]);
  const { openCart, cartCount, totalPrice } = useCart();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const { wishlist } = useWishlist();
  const router = useRouter();
  const [openBrands, setOpenBrands] = useState<string[]>([]);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search for products...");
  
  const [expandedTransmissionIndex, setExpandedTransmissionIndex] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [popupSearchQuery, setPopupSearchQuery] = useState("");
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [mode, setMode] = useState("categoryList"); // instead of "top"
  const [isDesktopCategoryOpen, setIsDesktopCategoryOpen] = useState(false);
  const [showMainHeader, setShowMainHeader] = useState(true); // for hiding logo/search on scroll



  const dropdownRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);
  const [dropdownResults, setDropdownResults] = useState<{
    products: ProductResult[];
    blogs: BlogResult[];
  }>({ products: [], blogs: [] });

  const [popupDropdownResults, setPopupDropdownResults] = useState<{ 
    products: ProductResult[]; 
    blogs: BlogResult[] 
  }>({ products: [], blogs: [] });

// Categories array with multilingual support
const categories = [
  {
    brand: { en: "Toyota", fr: "Toyota", es: "Toyota", de: "Toyota" },
    subcategories: [
      { en: "Toyota Swaps", fr: "Échanges Toyota", es: "Intercambios Toyota", de: "Toyota Swaps" },
      { en: "Toyota Engines", fr: "Moteurs Toyota", es: "Motores Toyota", de: "Toyota Motoren" },
      { en: "Toyota Transmissions", fr: "Transmissions Toyota", es: "Transmisiones Toyota", de: "Toyota Getriebe" }
    ]
  },
  {
    brand: { en: "Honda", fr: "Honda", es: "Honda", de: "Honda" },
    subcategories: [
      { en: "Honda Swaps", fr: "Échanges Honda", es: "Intercambios Honda", de: "Honda Swaps" },
      { en: "Honda Engines", fr: "Moteurs Honda", es: "Motores Honda", de: "Honda Motoren" },
      { en: "Honda Transmissions", fr: "Transmissions Honda", es: "Transmisiones Honda", de: "Honda Getriebe" }
    ]
  },
  {
    brand: { en: "Infiniti", fr: "Infiniti", es: "Infiniti", de: "Infiniti" },
    subcategories: [
      { en: "Infiniti Swaps", fr: "Échanges Infiniti", es: "Intercambios Infiniti", de: "Infiniti Swaps" },
      { en: "Infiniti Engines", fr: "Moteurs Infiniti", es: "Motores Infiniti", de: "Infiniti Motoren" },
      { en: "Infiniti Transmissions", fr: "Transmissions Infiniti", es: "Transmisiones Infiniti", de: "Infiniti Getriebe" }
    ]
  },
  {
    brand: { en: "Scion", fr: "Scion", es: "Scion", de: "Scion" },
    subcategories: [
      { en: "Scion Swaps", fr: "Échanges Scion", es: "Intercambios Scion", de: "Scion Swaps" },
      { en: "Scion Engines", fr: "Moteurs Scion", es: "Motores Scion", de: "Scion Motoren" },
      { en: "Scion Transmissions", fr: "Transmissions Scion", es: "Transmisiones Scion", de: "Scion Getriebe" }
    ]
  },
  {
    brand: { en: "Nissan", fr: "Nissan", es: "Nissan", de: "Nissan" },
    subcategories: [
      { en: "Nissan Swaps", fr: "Échanges Nissan", es: "Intercambios Nissan", de: "Nissan Swaps" },
      { en: "Nissan Engines", fr: "Moteurs Nissan", es: "Motores Nissan", de: "Nissan Motoren" },
      { en: "Nissan Transmissions", fr: "Transmissions Nissan", es: "Transmisiones Nissan", de: "Nissan Getriebe" }
    ]
  },
  {
    brand: { en: "Subaru", fr: "Subaru", es: "Subaru", de: "Subaru" },
    subcategories: [
      { en: "Subaru Swaps", fr: "Échanges Subaru", es: "Intercambios Subaru", de: "Subaru Swaps" },
      { en: "Subaru Engines", fr: "Moteurs Subaru", es: "Motores Subaru", de: "Subaru Motoren" },
      { en: "Subaru Transmissions", fr: "Transmissions Subaru", es: "Transmisiones Subaru", de: "Subaru Getriebe" }
    ]
  },
  {
    brand: { en: "Acura", fr: "Acura", es: "Acura", de: "Acura" },
    subcategories: [
      { en: "Acura Swaps", fr: "Échanges Acura", es: "Intercambios Acura", de: "Acura Swaps" },
      { en: "Acura Engines", fr: "Moteurs Acura", es: "Motores Acura", de: "Acura Motoren" },
      { en: "Acura Transmissions", fr: "Transmissions Acura", es: "Transmisiones Acura", de: "Acura Getriebe" }
    ]
  },
  {
    brand: { en: "Lexus", fr: "Lexus", es: "Lexus", de: "Lexus" },
    subcategories: [
      { en: "Lexus Swaps", fr: "Échanges Lexus", es: "Intercambios Lexus", de: "Lexus Swaps" },
      { en: "Lexus Engines", fr: "Moteurs Lexus", es: "Motores Lexus", de: "Lexus Motoren" },
      { en: "Lexus Transmissions", fr: "Transmissions Lexus", es: "Transmisiones Lexus", de: "Lexus Getriebe" }
    ]
  },
  
];

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownResults({ products: [], blogs: [] });
    }
  }

  if (dropdownResults.products.length || dropdownResults.blogs.length) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [dropdownResults, setDropdownResults]);

  const [translatedTexts, setTranslatedTexts] = useState({
    login: '',
    specialOffer: '',
    Shipping: '',
    Warranty: '',
    TrackOrder: '',
    aquaBite: '',
    shopNow: ''
  });


  const toSlug = (text: string): string => {
    const baseSlug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
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

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowMainHeader(false); // hide logo/search/top bar
    } else {
      setShowMainHeader(true); // show them back
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


// Fetch translations and menu items on mount
  useEffect(() => {
    async function fetchTranslations() {
      const items: MenuItem[] = [
        {
          name: await translate("ENGINES"),
          link: "/engines",
          customDropdownType: "category",
          subLinks: [
            {
              name: await translate("Toyota Engines"),
              link: "/toyota",
              subMenu: [
                { name: await translate("2GR-FKS"), link: `/toyota?category=${toSlug("2GR-FKS")}` },
                
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
    
    
    { name: await translate("FB20"), link: `/subaru?category=${toSlug("FB20")}` },
    
    { name: await translate("EJ205"), link: `/subaru?category=${toSlug("EJ205")}` },
    { name: await translate("FA20DIT"), link: `/subaru?category=${toSlug("FA20DIT")}` },
     { name: await translate("FB25"), link: `/subaru?category=${toSlug("FB25")}` },
  ],
}, 
{
  name: await translate("Acura  Engines"),
  link: "/acura",
  subMenu: [
    
    { name: await translate("K24A"), link: `/acura?category=${toSlug("K24A")}` },
   
    
    { name: await translate("J37A1"), link: `/acura?category=${toSlug("J37A1")}` },
    { name: await translate("J32A3"), link: `/acura?category=${toSlug("J32A3")}` },
    { name: await translate("J35A"), link: `/acura?category=${toSlug("J35A")}` },
   
  ], 
},

             {
  name: await translate("Infiniti  Engines"),
  link: "/infiniti",
  subMenu: [
    { name: await translate("VQ35DE"), link: `/infiniti?category=${toSlug("VQ35DE")}` },
   
    
    
    { name: await translate("VK45DE"), link: `/infiniti?category=${toSlug("VK45DE")}` },
    { name: await translate("VQ35"), link: `/infiniti?category=${toSlug("VQ35")}` },
     { name: await translate("VG30DE"), link: `/infiniti?category=${toSlug("VG30DE")}` },
      { name: await translate("VQ35HR"), link: `/infiniti?category=${toSlug("VQ35HR")}` },
    
  ],
},  

           {
  name: await translate("Scion  Engines"),
  link: "/scion",
  subMenu: [
    
    
    { name: await translate("2AZ-FE"), link: `/scion?category=${toSlug("2AZ-FE")}` },
    { name: await translate("FA20"), link: `/scion?category=${toSlug("FA20")}` },
    
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
  
    
  ],
},   

           {
  name: await translate("Honda  Engines"),
  link: "/honda",
  subMenu: [
    
    { name: await translate("K24A"), link: `/honda?category=${toSlug("K24A")}` },
    { name: await translate("R18A"), link: `/honda?category=${toSlug("R18A")}` },
    { name: await translate("D17A"), link: `/honda?category=${toSlug("D17A")}` },
    { name: await translate("J30A"), link: `/honda?category=${toSlug("J30A")}` },
     { name: await translate("J35A"), link: `/honda?category=${toSlug("J35A")}` },
     { name: await translate("K24W"), link: `/honda?category=${toSlug("K24W")}` },
    
  ],
}, 
{
  name: await translate("Lexus  Engines"),
  link: "/lexus",
  subMenu: [
    { name: await translate("2GR-FE"), link: `/lexus?category=${toSlug("2GR-FE")}` },
    { name: await translate("2GR-FKS"), link: `/lexus?category=${toSlug("2GR-FKS")}` },
    { name: await translate("2GR-FSE"), link: `/lexus?category=${toSlug("2GR-FSE")}` },
    { name: await translate("3UZ-FE"), link: `/lexus?category=${toSlug("3UZ-FE")}` },
      { name: await translate("1MZ-FE"), link: `/lexus?category=${toSlug("1MZ-FE")}` },
    // Add others as you get more data
  ],
},  
          ],
        },

        
      
      {
  name: await translate("TRANSMISSION"),  // plural sounds better here
    link: "/transmissions",
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
  link: "/swaps",
  subLinks: [
    { name: `${await translate("Toyota")} ${await translate("Swaps")}`, link: "/swaps/toyota" },
    { name: `${await translate("Nissan")} ${await translate("Swaps")}`, link: "/swaps/nissan" },
    { name: `${await translate("Honda")} ${await translate("Swaps")}`, link: "/swaps/honda" },
    { name: `${await translate("Subaru")} ${await translate("Swaps")}`, link: "/swaps/subaru" },
    { name: `${await translate("Infiniti")} ${await translate("Swaps")}`, link: "/swaps/infiniti" },
  ]
}
,

      { name: await translate("ABOUT US"), link: `/${language}/about-us` },
       
        
        {
          name: await translate("SUPPORT"), link: "/support",
          subLinks: [
          { name: await translate("FAQS"), link: `/${language}/support/faqs` },
          { name: await translate("BLOG"), link: "/blog" },
            
            { 
  name: await translate("Buyer Services"), 
  link: `/${language}/support/buyer-services` 
}

           
          ]
        },
 { name: await translate("REVIEWS"), link: "/reviews" },
        
        
      ];
      


  
 
      setTranslatedMenuItems(items);

      const aquaBite = await translate("16Zips");
      const login = await translate("Login");
      const Warranty = await translate("Warranty");
      const Shipping = await translate("Shipping");
      const TrackOrder = await translate("Track Order");
      const shopNow = await translate("Shop Now");
      const specialOffer = await translate("Quality You Can Trust");
      setTranslatedTexts({ aquaBite, login, specialOffer, shopNow, Shipping, Warranty, TrackOrder });
    }

    fetchTranslations().catch(console.error);
  }, [translate]);

  const languages = ["en", "es", "fr", "it"];
const staticPages = [
  "privacy-policy",
  "terms-conditions",
  "buyer-services",
  "about-us",
  "refund-policy",
  "shipping",
  "faqs",
  "track-order",
  "warranty"
];

const knownPaths = languages.flatMap(lang =>
  staticPages.map(page => `/${lang}/${page}`)
);

console.log(knownPaths);

// Helper to safely build localized paths; fall back to non-localized path if language missing
const localized = (path: string) => {
  if (!path.startsWith('/')) path = `/${path}`;
  return language ? `/${language}${path}` : path;
};

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
     console.log("Searching:", searchQuery, "in category:", selectedCategory);
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
    if (products.length) {
      const slug = typeof products[0].slug === 'string' ? products[0].slug : products[0].slug.en;
      router.push(`/products/${slug}?lang=${language}`);
    } else if (blogs.length) {
      const slug = typeof blogs[0].slug === 'string' ? blogs[0].slug : blogs[0].slug.en;
      router.push(`/blog/${slug}?lang=${language}`);
    }

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

// Fetch & show results as user types
const handlePopupLiveSearch = async (query: string) => {
  if (!query.trim()) {
    setPopupDropdownResults({ products: [], blogs: [] });
    return;
  }

  try {
    const res = await fetch(`/api/search?search=${encodeURIComponent(query)}&lang=${language}`);
    const { products, blogs } = await res.json();
    setPopupDropdownResults({ products, blogs });
  } catch (error) {
    console.error("Live search failed:", error);
    setPopupDropdownResults({ products: [], blogs: [] });
  }
};

// Run when pressing Enter / clicking search button
const doPopupSearch = async () => {
  if (!popupSearchQuery.trim()) return;

  try {
    const matchedPath = knownPaths.find(path =>
      path.toLowerCase().includes(popupSearchQuery.trim().toLowerCase())
    );

    if (matchedPath) {
      router.push(matchedPath);
    } else {
      const res = await fetch(`/api/search?search=${encodeURIComponent(popupSearchQuery.trim())}&lang=${language}`);
      const { products, blogs } = await res.json();

      if (products.length) {
        const slug = typeof products[0].slug === "string" ? products[0].slug : products[0].slug.en;
        router.push(`/products/${slug}?lang=${language}`);
      } else if (blogs.length) {
        const slug = typeof blogs[0].slug === "string" ? blogs[0].slug : blogs[0].slug.en;
        router.push(`/blog/${slug}?lang=${language}`);
      } else {
        toast.error("No matching results found.");
      }
    }
  } catch (error) {
    console.error("Error during search:", error);
    toast.error("Something went wrong. Please try again.");
  }

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
      const placeholder = await translate("Search for products");
      setSearchPlaceholder(placeholder || "Search for products");
    }
    fetchPlaceholderTranslation().catch(console.error);
  }, [translate]);

  useEffect(() => {
  setExpandedTransmissionIndex(null);
}, [mode]);



  return (
    <div className="w-full fixed top-0 z-50 left-0 shadow-lg">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* TOP BAR - Contact Info and Links */}
      {showMainHeader && (
      <div className="bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            {/* Left: Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 font-semibold">
                
               Quality You Can Trust
              </div>
              <div className="flex items-center space-x-2">

      
   
              </div>
              
            </div>
        {/* Left: Contact Info - Mobile (centered, <=750px) */} <div className=" items-center justify-center w-full max-[750px]:flex hidden"> <div className="font-semibold text-center"> Quality You Can Trust </div> </div>





            {/* Right: Navigation Links */}
            <div className="hidden md:flex items-center space-x-4" style={{ position: 'relative', zIndex: 70, pointerEvents: 'auto' }}>
              <Link href={localized('/track-order')} onClick={() => console.log('top link: track-order clicked')} className="hover:text-gray-200 transition uppercase text-xs font-semibold">
                TRACK ORDER
              </Link>
              <Link href={localized('/shipping')} onClick={() => console.log('top link: shipping clicked')} className="hover:text-gray-200 transition uppercase text-xs font-semibold">
                SHIPPING
              </Link>

              <Link href={localized('/warranty')} onClick={() => console.log('top link: warranty clicked')} className="hover:text-gray-200 transition uppercase text-xs font-semibold">
                WARRANTY
              </Link>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* MIDDLE BAR - Logo, Search, Icons */}
     {/* MIDDLE BAR - Logo, Search, Icons */}
     {showMainHeader && (
<div className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="relative flex items-center justify-between h-16 md:h-20 lg:h-24">


      {/* Mobile Menu Button (visible only on md and below) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-red-600 focus:outline-none"
        aria-label="Open menu"
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Logo — centered on mobile, left on md+ */}
      <div className="flex-1 flex justify-center md:justify-start">
        <Link href={`/?lang=${language}`} className="flex-shrink-0">
          <div className="relative w-[220px] h-[150px]">
            <Image
              src="/assets/logo.png"
              alt="DriveCore Auto"
              fill
              style={{ objectFit: "contain" }}
              sizes="220px"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Search Bar (Desktop, centered) */}
      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4">
          <div ref={dropdownRef} className="flex w-full relative">
          <div className="flex w-full border-2 border-gray-300 rounded-md overflow-visible">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 px-4 py-3 outline-none text-gray-700"
            />

            {/* Category Dropdown */}
           {/* Category Dropdown (Desktop Only) */}
<div className="relative border-l-2 border-gray-300">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setIsDesktopCategoryOpen(!isDesktopCategoryOpen);
    }}
    className="flex items-center px-4 py-3 transition whitespace-nowrap"
  >
    <span className="text-sm font-medium text-gray-700 mr-2">
      {selectedCategory || "SELECT CATEGORY"}
    </span>
    <ChevronDown
      className={`w-4 h-4 transition-transform ${
        isDesktopCategoryOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {isDesktopCategoryOpen && (
    <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
      {categories.map((cat) => (
        <div key={cat.brand.en}>
          <div
            className="px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedCategory(cat.brand[language as keyof typeof cat.brand]);
              setIsDesktopCategoryOpen(false);
            }}
          >
            {cat.brand[language as keyof typeof cat.brand]}
          </div>
          {cat.subcategories.map((sub) => (
            <div
              key={sub.en}
              className="pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedCategory(sub[language as keyof typeof sub]);
                setIsDesktopCategoryOpen(false);
              }}
            >
              {sub[language as keyof typeof sub]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )}
</div>

            {/* Search Button */}
            <button
              onClick={() => { /* your search handler */ }}
              className="px-6 bg-blue-800 hover:bg-blue-700 transition text-white"
            >
              <FaSearch className="text-lg" />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {(dropdownResults.products.length > 0 || dropdownResults.blogs.length > 0) && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-96 overflow-y-auto">
              {/* X icon to close */}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
                onClick={() => setDropdownResults({ products: [], blogs: [] })}
                aria-label="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              {/* PRODUCTS HEADER */}
              {dropdownResults.products.length > 0 && (
                <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
                  PRODUCTS
                </div>
              )}

              {/* Grid of product results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-4 max-h-[320px] overflow-y-auto">
                {dropdownResults.products.map((product) => {
                  const slug = typeof product.slug === "string" ? product.slug : product.slug.en;
                  return (
                    <div
                      key={slug}
                      className="flex flex-col items-center bg-gray-50 rounded-md p-3 cursor-pointer hover:bg-gray-100 transition shadow"
                      onClick={() => {
                        router.push(`/products/${slug}?lang=${language}`);
                        setDropdownResults({ products: [], blogs: [] });
                        setSearchQuery('');
                      }}
                    >
                      <img
                        src={product.mainImage || '/placeholder.jpg'}
                        alt={product.name[language]}
                        className="w-20 h-20 object-cover rounded border mb-2"
                      />
                      <div className="font-semibold text-center text-gray-800 text-sm">
                        {product.name[language]}
                      </div>
                      <div className="text-xs text-gray-500 text-center mb-1">
                        {product.subText || ''}
                      </div>
                      <div className="text-rose-500 font-semibold">
                        {product.price ? `$${product.price}` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all results */}
              {dropdownResults.products.length > 0 && (
                <div
                  className="text-center py-3 text-blue-600 hover:underline hover:bg-gray-50 cursor-pointer text-sm font-medium border-t"
                  onClick={() => {
                    router.push(`/search?query=${searchQuery}`);
                    setDropdownResults({ products: [], blogs: [] });
                    setSearchQuery('');
                  }}
                >
                  VIEW ALL RESULTS
                </div>
              )}

              {/* BLOGS HEADER */}
              {dropdownResults.blogs.length > 0 && (
                <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
                  BLOGS
                </div>
              )}

              {/* Blog results */}
              <div className="px-4 py-2">
                {dropdownResults.blogs.map((blog) => {
                  const slug = typeof blog.slug === "string" ? blog.slug : blog.slug.en;
                  return (
                    <div
                      key={slug}
                      className="py-2 px-2 rounded hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => {
                        router.push(`/blog/${slug}?lang=${language}`);
                        setDropdownResults({ products: [], blogs: [] });
                        setSearchQuery('');
                      }}
                    >
                      <div className="font-semibold">{blog.title[language]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Icons */}
     {/* Right Icons — include mobile search icon */}
<div className="flex items-center space-x-4 md:space-x-6" style={{ position: 'relative', zIndex: 120, pointerEvents: 'auto' }}>
  {/* Mobile Search Icon */}
  <button
    onClick={() => setIsSidebarOpen(true)}
    className="lg:hidden text-gray-700 hover:text-red-600"
    aria-label="Search"
  >
    <FaSearch className="text-2xl" />
  </button>

  {/* Desktop Icons (user, wishlist, cart) */}
  <Link href="/profile" className="hidden lg:block">
    <FaUser className="text-2xl text-gray-700 hover:text-blue-600 transition cursor-pointer" />
  </Link>

<Link href={`/${language}/wishlist`} className="relative hidden md:block">
  <FaHeart className="text-2xl text-gray-700 hover:text-blue-600 transition cursor-pointer" />
  
  {/* Always show count, 0 if empty */}
  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
    {wishlist.length || 0}
  </span>
</Link>


  <div className="flex items-center gap-2 relative cursor-pointer" onClick={openCart}>
    <div className="relative">
      <FaShoppingCart className="text-2xl text-gray-700 hover:text-red-600 transition" />
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
        {cartCount || 0}
      </span>
    </div>
    <div className="text-xs text-gray-600 font-semibold hidden lg:block"> ${totalPrice.toFixed(2)}</div>
  </div>

      </div>
    </div>
  </div>
</div>
      )}


      {/* BOTTOM NAVIGATION BAR */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1">
            
            {/* Browse by Make Button */}
          {/* Browse by Make - Hover Mega Menu */}
<div className="relative group" ref={browseRef}>
  <button className="flex items-center px-6 py-4 bg-blue-800 hover:bg-blue-800 text-white font-bold uppercase text-sm transition">
    <FaBars className="mr-3" />
    BROWSE BY MAKE
    <ChevronDown className="ml-3 w-4 h-4" />
  </button>

  {/* Mega Menu Dropdown - Appears on hover */}
  <div className="absolute left-0 top-full w-64 bg-white border border-gray-200 shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
    {categories
      .filter(cat => cat.subcategories.length > 0)
      .map((cat) => {
        const brandName = cat.brand.en;
        const brandSlug = toSlug(brandName); // e.g., "toyota", "nissan"
        const hasSwaps = !['Acura', 'Lexus', 'Scion'].includes(brandName);

        return (
          <div key={brandName} className="relative group/item border-b border-gray-100 last:border-b-0">
            <div className="px-4 py-3 font-semibold text-gray-800 group-hover/item:bg-blue-50 cursor-pointer">
              {brandName}
            </div>

            {/* Submenu on hover */}
            <div className="absolute left-full top-0 w-64 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 z-50">
              {/* ENGINES */}
              <Link
                href={`/${brandSlug}`}
                className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                onClick={() => setIsBrowseOpen(false)}
              >
                {brandName} Engines
              </Link>

              {/* TRANSMISSIONS */}
              <Link
                href={`/transmissions/${brandSlug}/automatic`}
                className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                onClick={() => setIsBrowseOpen(false)}
              >
                {brandName} Transmissions
              </Link>

              {/* SWAPS (conditional) */}
              {hasSwaps && (
                <Link
                  href={`/swaps/${brandSlug}`}
                  className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                  onClick={() => setIsBrowseOpen(false)}
                >
                  {brandName} Swaps
                </Link>
              )}
            </div>
          </div>
        );
      })}
  </div>
</div>

            {/* Main Navigation Links */}
            <nav className="flex items-center space-x-1">
              <Link
                href="/engines"
                className="px-4 py-4 text-sm font-bold uppercase text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                ENGINES
              </Link>
              <Link
                href="/transmissions"
                className="px-4 py-4 text-sm font-bold uppercase text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                TRANSMISSIONS
              </Link>
              <Link
                href="/swaps"
                className="px-4 py-4 text-sm font-bold uppercase text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                SWAPS
              </Link>
               <Link href={`/${language}/about-us`} className="px-4 py-4 text-sm font-bold uppercase text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition">
                ABOUT US
              </Link>
              <Link
                href="/blog"
                className="px-4 py-4 text-sm font-bold uppercase text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                Blog
              </Link>
              <Link
                href="/reviews"
                className="px-4 py-4 text-sm font-bold uppercase text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition"
              >
                REVIEWS
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Keep your existing mobile sidebar code */}
{isSidebarOpen && (
  <div
    className="fixed inset-0  bg-opacity-50 z-50"
    onClick={() => setIsSidebarOpen(false)}
  >
    <div
      className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4  flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-2xl text-gray-700"
        >
          <FaTimes />
        </button>
        
      </div>
      {/* Search Input */}
<div className="relative mb-4">
  <input
    type="text"
    value={popupSearchQuery}
    onChange={(e) => {
      const q = e.target.value;
      setPopupSearchQuery(q);
      handlePopupLiveSearch(q);
    }}
    placeholder={searchPlaceholder}
    className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"
    onKeyDown={(e) => e.key === 'Enter' && doPopupSearch()}
  />
  <button
    onClick={doPopupSearch}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    <FaSearch />
  </button>
</div>

{/* Mobile Search Results - Render BELOW input (not absolute!) */}
{(popupDropdownResults.products.length > 0 || popupDropdownResults.blogs.length > 0) && (
  <div className="mt-2 border border-gray-200 rounded-md shadow-lg bg-white max-h-96 overflow-y-auto">
    {/* Close button (optional) */}
    <button
      className="float-right p-2 text-gray-400 hover:text-gray-600"
      onClick={() => setPopupDropdownResults({ products: [], blogs: [] })}
    >
      <FaTimes />
    </button>

    {/* PRODUCTS */}
    {popupDropdownResults.products.length > 0 && (
      <>
        <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
          PRODUCTS
        </div>
        <div className="p-4 space-y-3">
          {popupDropdownResults.products.map((product) => {
            const slug = typeof product.slug === "string" ? product.slug : product.slug.en;
            return (
              <div
                key={slug}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => {
                  router.push(`/products/${slug}?lang=${language}`);
                  setIsSidebarOpen(false);
                  setPopupSearchQuery('');
                  setPopupDropdownResults({ products: [], blogs: [] });
                }}
              >
                <img
                  src={product.mainImage || '/placeholder.jpg'}
                  alt={product.name[language]}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-medium text-gray-800">{product.name[language]}</div>
                  {product.price && (
                    <div className="text-sm text-rose-500">${product.price}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    )}

    {/* BLOGS */}
    {popupDropdownResults.blogs.length > 0 && (
      <>
        <div className="border-t border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
          BLOGS
        </div>
        <div className="p-4 space-y-2">
          {popupDropdownResults.blogs.map((blog) => {
            const slug = typeof blog.slug === "string" ? blog.slug : blog.slug.en;
            return (
              <div
                key={slug}
                className="font-medium text-blue-600 hover:underline cursor-pointer py-1"
                onClick={() => {
                  router.push(`/blog/${slug}?lang=${language}`);
                  setIsSidebarOpen(false);
                  setPopupSearchQuery('');
                  setPopupDropdownResults({ products: [], blogs: [] });
                }}
              >
                {blog.title[language]}
              </div>
            );
          })}
        </div>
      </>
    )}

    {/* VIEW ALL */}
    <div
      className="text-center py-2 text-blue-600 hover:underline cursor-pointer text-sm font-medium border-t"
      onClick={() => {
        router.push(`/search?query=${popupSearchQuery}`);
        setIsSidebarOpen(false);
        setPopupSearchQuery('');
        setPopupDropdownResults({ products: [], blogs: [] });
      }}
    >
      VIEW ALL RESULTS
    </div>
  </div>
)}

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-center font-medium transition ${
            mode === "top" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setMode("top")}
        >
          MENU
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium transition ${
            mode !== "top" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setMode("categoryList")}
        >
          CATEGORIES
        </button>
      </div>

      {/* Content */}

      
      <div className="p-4">
        {mode === "top" ? (
          // MENU Tab Content
          <nav className="space-y-2 ">
            {translatedMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="block py-2 px-3 rounded hover:bg-gray-100 border-b border-gray-200 pb-1"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.name}
              </Link>
            ))}
           
           
          </nav>
        ) : (
          // CATEGORIES Tab Content




<div className="space-y-1">
  {categories.map((cat) => {
    const brandName = cat.brand[language as keyof typeof cat.brand] || cat.brand.en;
    const brandSlug = toSlug(brandName);
    const hasSwaps = !['Acura', 'Lexus', 'Scion'].includes(brandName);
    const isOpen = openBrands.includes(brandName);

    return (
      <div key={brandName} className="space-y-1 border-b border-gray-200 pb-1">
        {/* Brand Header */}
        <div
          className="flex justify-between items-center py-3 px-3 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            if (isOpen) {
              setOpenBrands(openBrands.filter(b => b !== brandName));
            } else {
              setOpenBrands([...openBrands, brandName]);
            }
          }}
        >
          <span className="font-medium">{brandName}</span>
          <ChevronRight
            className={`w-4 h-4 text-gray-500 transform transition-transform ${
              isOpen ? 'rotate-90' : ''
            }`}
          />
        </div>

        {/* Subcategories */}
        {isOpen && (
          <div className="pl-5 space-y-1 ">
            {/* Engines */}
            <Link
              href={`/${brandSlug}`}
              className="block py-2 px-3 rounded hover:bg-red-50 font-medium text-gray-700 border-b border-gray-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              Engines
            </Link>

            {/* Transmissions */}
            <Link
              href={`/transmissions/${brandSlug}/automatic`}
              className="block py-2 px-3 rounded hover:bg-red-50 font-medium text-gray-700 border-b border-gray-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              Transmissions
            </Link>

            {/* Swaps */}
            {hasSwaps && (
              <Link
                href={`/swaps/${brandSlug}`}
                className="block py-2 px-3 rounded hover:bg-red-50 font-medium text-gray-700 "
                onClick={() => setIsSidebarOpen(false)}
              >
                Swaps
              </Link>
            )}
          </div>
        )}
      </div>
    );
  })}

     {/* Login / Register Section */}
<div className="border-b border-gray-200 pb-4 mb-4">
  <Link
    href="/profile"
    className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-blue-800 font-medium"
    onClick={() => setIsSidebarOpen(false)}
  >
    <FaUser className="text-lg" />
    <span>Login / Register</span>
  </Link>
</div>
</div>


        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Navbar;