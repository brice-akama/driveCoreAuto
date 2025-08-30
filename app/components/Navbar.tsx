'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaSearch, FaUser, FaBars, FaTimes, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";




type SubMenuItem = {
  name: string;
  link: string;
  subMenu?: SubMenuItem[];
};

interface ProductResult {
  _id: string;        // or ObjectId if you want
  name: Record<string, string>;  // multilingual object
  slug: string | { en: string };
  category?: string;
  mainImage?: string;
  subText?: string;
  price?: number | string;
}

interface BlogResult {
  _id: string;
  title: Record<string, string>; // multilingual object
 slug: string | { en: string };
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
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const { wishlist } = useWishlist();
  const router = useRouter();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search...");
  const [mode, setMode] = useState<Mode>("top");
  const [expandedTransmissionIndex, setExpandedTransmissionIndex] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
const [popupSearchQuery, setPopupSearchQuery] = useState("");
const { language } = useLanguage();

const dropdownRef = useRef<HTMLDivElement>(null);
const [dropdownResults, setDropdownResults] = useState<{
  products: ProductResult[];
  blogs: BlogResult[];
}>({ products: [], blogs: [] });

const [popupDropdownResults, setPopupDropdownResults] = useState<{ 
  products: ProductResult[]; 
  blogs: BlogResult[] 
}>({ products: [], blogs: [] });





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



// Example categories array
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
  // Single categories without subcategories
  { brand: { en: "Accessories", fr: "Accessoires", es: "Accesorios", de: "Zubehör" }, subcategories: [] },
  { brand: { en: "Subframe", fr: "Châssis", es: "Subchasis", de: "Unterrahmen" }, subcategories: [] },
  { brand: { en: "Free Shipping", fr: "Livraison gratuite", es: "Envío gratis", de: "Kostenloser Versand" }, subcategories: [] },
  { brand: { en: "Best Sellers", fr: "Meilleures ventes", es: "Más vendidos", de: "Bestseller" }, subcategories: [] }
];


useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If dropdown exists and the clicked element is not inside it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }

    // Listen to all clicks on the page
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    { name: `${await translate("Toyota")} ${await translate("Swaps")}`, link: "/swaps/toyota" },
    { name: `${await translate("Nissan")} ${await translate("Swaps")}`, link: "/swaps/nissan" },
    { name: `${await translate("Honda")} ${await translate("Swaps")}`, link: "/swaps/honda" },
    { name: `${await translate("Subaru")} ${await translate("Swaps")}`, link: "/swaps/subaru" },
    { name: `${await translate("Infiniti")} ${await translate("Swaps")}`, link: "/swaps/infiniti" },
  ]
}
,

      { name: await translate("ABOUT US"), link: `/${language}/about-us` },
        { name: await translate("BLOG"), link: "/blog" },
        
        {
          name: await translate("SUPPORT"), link: "/support",
          subLinks: [
          { name: await translate("FAQS"), link: `/${language}/support/faqs` },
            
            { 
  name: await translate("Buyer Services"), 
  link: `/${language}/support/buyer-services` 
}

           
          ]
        },

        
        
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
        {translatedTexts.Warranty}
    </Link>
  <Link
href={`/${language}/shipping`}
  className="text-sm font-bold text-black hover:text-blue-900 uppercase transition"
>
   {translatedTexts.Shipping}
</Link>

    <Link
          href={`/${language}/track-order`}
      className="text-sm font-bold text-black hover:text-blue-900 uppercase transition"
    >
      {translatedTexts.TrackOrder}
    </Link>
  </div>
</div>

      {/* Secondary Navbar */}
      <div className="bg-white shadow-md  py-4 px-12 flex justify-between items-center h-20 mt-8">
        <div className="flex items-center space-x-4 bg-transparent">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-lg">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          <Link
  href={`/?lang=${language}`}
  className="hidden md:block mt-4 bg-transparent"
>
  <div className="relative w-[250px] h-[150px]">
    <Image
      src="/assets/logo.png"
      alt="logo"
      fill
      style={{ objectFit: "contain" }}
      priority
    />
  </div>
</Link>

<div className="md:hidden w-full flex justify-start">
  <Link href={`/?lang=${language}`} className="block bg-transparent">
    <div className="relative w-[200px] h-[150px]">
      <Image
        src="/assets/logo.png"
        alt="logo"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  </Link>
</div>



        </div>

        


<div
ref={dropdownRef}
className="relative w-1/2 mx-auto mt-3 hidden lg:flex">
  <div className="flex items-center bg-gray-50 rounded-full shadow-inner px-6 py-3 w-full">

    {/* Search Icon */}
  <button onClick={handleSearch} className="flex-shrink-0 mr-3">
    <FaSearch className="text-gray-500 text-xl" />
  </button>

      {/* Search Input */}
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={searchPlaceholder}
      className="flex-grow bg-transparent outline-none text-gray-800 text-lg"
    />
    
    
    <div className="w-px bg-gray-300 self-stretch"></div>
  

    {/* Select Category */}
    
    {/* Select Category */}
<div ref={dropdownRef}
  className="relative flex items-center px-4 cursor-pointer"
  onClick={() => setIsCategoryOpen((open) => !open)}
>
  <span className="text-gray-700 font-normal text-base flex items-center gap-2">
    {selectedCategory || (language === 'en' ? "All Categories" :
                          language === 'fr' ? "Toutes les catégories" :
                          language === 'es' ? "Todas las categorías" :
                          "Alle Kategorien")}
    <ChevronDown
      className={`w-4 h-4 ml-1 transition-transform duration-300 ${
        isCategoryOpen ? "rotate-180" : ""
      }`}
    />
  </span>

  {isCategoryOpen && (
    <div className="absolute right-0 top-full mt-2 w-56 max-h-64 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
      {categories.map((cat) => (
  <div key={cat.brand.en}>
    {/* Main brand name */}
    <div
      className="px-4 py-2 font-semibold text-gray-800 cursor-pointer hover:bg-blue-50"
      onClick={() => {
        setSelectedCategory(cat.brand[language as keyof typeof cat.brand]);
        setIsCategoryOpen(false);
      }}
    >
      {cat.brand[language as keyof typeof cat.brand]}
    </div>

    {/* Subcategories */}
    {cat.subcategories.map((sub) => (
      <div
        key={sub.en}
        className="pl-8 pr-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-100"
        onClick={() => {
          setSelectedCategory(sub[language as keyof typeof sub]);
          setIsCategoryOpen(false);
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

    


    
  </div>
  {/* Dropdown */}
  {(dropdownResults.products.length || dropdownResults.blogs.length) > 0 && (
    <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50">

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
              <div className="text-rose-500 font-semibold">{product.price ? `$${product.price}` : ''}</div>
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
    setDropdownResults({ products: [], blogs: [] }); // close dropdown
    setSearchQuery(''); // optional: clear input
  }}
>
  VIEW ALL RESULTS
</div>

      )}

      {/* BLOGS HEADER */}
      {dropdownResults.blogs.length > 0 && (
        <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">BLOGS</div>
      )}

      {/* Blog results (shown below products) */}
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


        <div className="flex items-center space-x-2 ">
          <button
  onClick={() => {
    setIsSearchOpen(true);
    setPopupSearchQuery("");
  }}
  aria-label="Open search"
  className="text-2xl cursor-pointer text-black hover:text-blue-700 mt-3 lg:hidden "
>
  <FaSearch />
</button>

          <Link
  href={`/${language}/wishlist`}
  className="relative hidden md:flex"
>
  <FaHeart className="text-2xl cursor-pointer text-black hover:text-red-700 mt-3" />
  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-3">
    {wishlist.length}
  </span>
</Link>

<Link href="/profile">
            <FaUser className="text-2xl cursor-pointer hidden md:block mt-3" />
          </Link>
          <div id="cart-icon" className="relative">
  <FaShoppingCart
    className="cursor-pointer hover:text-gray-400 text-2xl mt-3"
    onClick={openCart}
  />
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-3">
    {cartCount}
  </span>
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

  {/* Dropdown (same as large devices) */}
  {(dropdownResults.products.length || dropdownResults.blogs.length) > 0 && (
    <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50">
      
      {/* Close dropdown */}
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
        onClick={() => setDropdownResults({ products: [], blogs: [] })}
        aria-label="Close"
      >
        <FaTimes className="w-5 h-5" />
      </button>

      {/* PRODUCTS */}
      {dropdownResults.products.length > 0 && (
        <>
          <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
            PRODUCTS
          </div>
          <div className="px-4 py-2 max-h-[250px] overflow-y-auto">
            {dropdownResults.products.map((product) => {
              const slug = typeof product.slug === "string" ? product.slug : product.slug.en;
              return (
                <div
                  key={slug}
                  className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-100 transition rounded"
                  onClick={() => {
                    router.push(`/products/${slug}?lang=${language}`);
                    setIsSidebarOpen(false);
                    setDropdownResults({ products: [], blogs: [] });
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={product.mainImage || "/placeholder.jpg"}
                    alt={product.name[language]}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {product.name[language]}
                    </div>
                    <div className="text-xs text-gray-500">{product.subText || ""}</div>
                    <div className="text-rose-500 font-semibold text-xs">
                      {product.price ? `$${product.price}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="text-center py-3 text-blue-600 hover:underline hover:bg-gray-50 cursor-pointer text-sm font-medium border-t"
            onClick={() => {
              router.push(`/search?query=${searchQuery}`);
              setIsSidebarOpen(false);
            }}
          >
            VIEW ALL RESULTS
          </div>
        </>
      )}

      {/* BLOGS */}
      {dropdownResults.blogs.length > 0 && (
        <>
          <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
            BLOGS
          </div>
          <div className="px-4 py-2">
            {dropdownResults.blogs.map((blog) => {
              const slug = typeof blog.slug === "string" ? blog.slug : blog.slug.en;
              return (
                <div
                  key={slug}
                  className="py-2 px-2 rounded hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => {
                    router.push(`/blog/${slug}?lang=${language}`);
                    setIsSidebarOpen(false);
                    setDropdownResults({ products: [], blogs: [] });
                    setSearchQuery("");
                  }}
                >
                  <div className="font-semibold">{blog.title[language]}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  )}
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
    onClick={() => setIsSearchOpen(false)}
  >
    <div
      className="bg-white p-6 rounded-lg w-full max-w-md relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={() => setIsSearchOpen(false)}
        aria-label="Close search"
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition text-xl"
      >
        <FaTimes />
      </button>

      {/* Input */}
      <div className="flex space-x-2 items-center mt-6">
        <input
          type="text"
          value={popupSearchQuery}
          onChange={(e) => {
            setPopupSearchQuery(e.target.value);
            handlePopupLiveSearch(e.target.value); // 🔥 fetch results instantly
          }}
          placeholder={searchPlaceholder}
          autoFocus
          className="flex-grow border border-gray-300 rounded px-4 py-2 text-lg outline-none"
        />
        <button
          onClick={() => handlePopupLiveSearch(popupSearchQuery)}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </div>

      {/* Dropdown Results */}
      {(popupDropdownResults.products.length > 0 ||
        popupDropdownResults.blogs.length > 0) && (
        <div className="mt-4 border rounded-lg shadow-md bg-white max-h-[320px] overflow-y-auto relative">
          {/* PRODUCTS */}
          {popupDropdownResults.products.length > 0 && (
            <>
              <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
                PRODUCTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-4">
                {popupDropdownResults.products.map((product) => {
                  const slug =
                    typeof product.slug === "string"
                      ? product.slug
                      : product.slug.en;
                  return (
                    <div
                      key={slug}
                      className="flex flex-col items-center bg-gray-50 rounded-md p-3 cursor-pointer hover:bg-gray-100 transition shadow"
                      onClick={() => {
                        router.push(`/products/${slug}?lang=${language}`);
                        setIsSearchOpen(false);
                        setPopupDropdownResults({ products: [], blogs: [] });
                        setPopupSearchQuery("");
                      }}
                    >
                      <img
                        src={product.mainImage || "/placeholder.jpg"}
                        alt={product.name[language]}
                        className="w-20 h-20 object-cover rounded border mb-2"
                      />
                      <div className="font-semibold text-center text-gray-800 text-sm">
                        {product.name[language]}
                      </div>
                      <div className="text-xs text-gray-500 text-center mb-1">
                        {product.subText || ""}
                      </div>
                      <div className="text-rose-500 font-semibold">
                        {product.price ? `$${product.price}` : ""}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all */}
              <div
                className="text-center py-3 text-blue-600 hover:underline hover:bg-gray-50 cursor-pointer text-sm font-medium border-t"
                onClick={() =>
                  router.push(`/search?query=${popupSearchQuery}`)
                }
              >
                VIEW ALL RESULTS
              </div>
            </>
          )}

          {/* BLOGS */}
          {popupDropdownResults.blogs.length > 0 && (
            <>
              <div className="border-b px-4 py-2 font-semibold text-xs text-gray-500 tracking-widest">
                BLOGS
              </div>
              <div className="px-4 py-2">
                {popupDropdownResults.blogs.map((blog) => {
                  const slug =
                    typeof blog.slug === "string" ? blog.slug : blog.slug.en;
                  return (
                    <div
                      key={slug}
                      className="py-2 px-2 rounded hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => {
                        router.push(`/blog/${slug}?lang=${language}`);
                        setIsSearchOpen(false);
                        setPopupDropdownResults({ products: [], blogs: [] });
                        setPopupSearchQuery("");
                      }}
                    >
                      <div className="font-semibold">
                        {blog.title[language]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default Navbar;
