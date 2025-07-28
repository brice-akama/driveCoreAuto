"use client";

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

type MenuItem = {
  name: string;
  link: string;
  subLinks?: (SubMenuItem | string)[];
  customDropdownType?: "category" | "default";
};

type Mode = "top" | "categoryList" | "supportList" | "transmissionsList" | { subIndex: number };

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
              name: await translate("Toyota"),
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
  name: await translate("Acura"),
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
  name: await translate("Infiniti"),
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
  name: await translate("Mercedes Benz"),
  link: "/mercedes",
  subMenu: [
    { name: await translate("OM651"), link: `/mercedes?category=${toSlug("OM651")}` },
    { name: await translate("M274"), link: `/mercedes?category=${toSlug("M274")}` },
    { name: await translate("M272"), link: `/mercedes?category=${toSlug("M272")}` },
    { name: await translate("OM642"), link: `/mercedes?category=${toSlug("OM642")}` },
    { name: await translate("M112"), link: `/mercedes?category=${toSlug("M112")}` },
    { name: await translate("M113"), link: `/mercedes?category=${toSlug("M113")}` },
    { name: await translate("OM606"), link: `/mercedes?category=${toSlug("OM606")}` },
    { name: await translate("OM646"), link: `/mercedes?category=${toSlug("OM646")}` },
  ],
},

            {
  name: await translate("Nissan"),
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
  name: await translate("Honda"),
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
  name: await translate("Lexus"),
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
{
  name: await translate("Subaru"),
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




          ],
        },
        { name: await translate("ABOUT US"), link: "/about-us" },
        { 
          name: await translate("Transmissions"), link: "/transmissions", 
          subLinks: [
            { name: await translate("Automatic"), link: "/transmissions/automatic" },
            { name: await translate("Manual"), link: "/transmissions/manual" },
            { name: await translate("Parts & Fluids"), link: "/transmissions/parts-fluids" }
          ]
        },
        { name: await translate("BLOG"), link: "/blog" },
        { 
          name: await translate("SUPPORT"), link: "/support",
          subLinks: [
            { name: await translate("FAQS"), link: "/support/faqs" },
            { name: await translate("Contact Us"), link: "/support/contact-us" },
            { name: await translate("Buyer Services"), link: "/support/buyer-services" }
          ]
        },
      ];
      setTranslatedMenuItems(items);

      const aquaBite = await translate("16Zips");
      const login = await translate("Login");
      const shopNow = await translate("Shop Now");
      const specialOffer = await translate("Special Offer: Get 20% Off on All Orders! Limited Time Only.");
      setTranslatedTexts({ aquaBite, login, specialOffer, shopNow });
    }

    fetchTranslations().catch(console.error);
  }, [translate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const knownPaths = ["/privacy-policy", "/terms", "/support", "/about-us", "/refund-policy", "/shipping-info", "/faqs", "/contact-us"];

    try {
      const matchedPath = knownPaths.find(path => path.toLowerCase().includes(searchQuery.trim().toLowerCase()));

      if (matchedPath) {
        router.push(matchedPath);
        setSearchQuery('');
        return;
      }

      const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery.trim())}`);
      const { redirectTo } = await res.json();

      if (redirectTo) {
        router.push(redirectTo);
        setSearchQuery('');
      } else {
        toast.error("No matching results found.");
        setSearchQuery('');
      }
    } catch (error) {
      console.error("Error during search:", error);
      toast.error("Something went wrong. Please try again.");
      setSearchQuery('');
    }
  };

  const handleDropdownEnter = (index: number) => {
  // Cancel any existing timeout so dropdown stays open while hovering
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    setHoverTimeout(null);
  }
  setActiveDropdown(index);
};

const handleDropdownLeave = () => {
  const timeout = setTimeout(() => {
    setActiveDropdown(null);
  }, 350); // 350ms delay before hiding dropdown
  setHoverTimeout(timeout);
};

  const goBack = () => {
    if (mode === "categoryList" || mode === "supportList" || mode === "transmissionsList") setMode("top");
    else setMode("categoryList");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  async function fetchPlaceholderTranslation() {
    const placeholder = await translate("Search...");
    setSearchPlaceholder(placeholder || "Search...");
  }

  fetchPlaceholderTranslation().catch(console.error);
}, [translate]);


  return (
    <div className="w-full fixed top-0 z-20 left-0">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Moving Text Bar */}
      <div className="absolute top-0 left-0 w-full bg-blue-100 h-10 overflow-hidden flex items-center justify-center">
        <p className="text-black text-sm font-semibold animate-marquee flex items-center gap-2">
          {translatedTexts.specialOffer}
          <Link href="/shop" className="text-blue-600 font-bold underline hover:text-blue-800 transition">
            {translatedTexts.shopNow} →
          </Link>
        </p>
      </div>

      {/* Secondary Navbar */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center h-20 mt-8">
        <div className="flex items-center space-x-4 bg-transparent">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-lg">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          <Link href="/" className="hidden md:block mt-4 bg-transparent">
            <Image src="/assets/logo.png" alt="logo" width={180} height={80} className="object-contain bg-transparent " />
          </Link>

          <div className="md:hidden w-full">
            <Link href="/" className="block bg-transparent">
              <Image src="/assets/logo.png" alt="logo" width={140} height={30} className="object-contain bg-transparent" />
            </Link>
          </div>
        </div>

        <div className="flex items-center w-1/2 bg-gray-50 rounded-full shadow-inner px-6 py-3 mx-auto mt-3 hidden md:flex">
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
        </div>

        <div className="flex items-center space-x-2 ">
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
        <div className="fixed inset-0 z-30 bg-opacity-50">
          <div className="fixed inset-0 z-40 bg-white w-64">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsSidebarOpen(false)}>
                <FaTimes className="text-xl" />
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

                    if (item.link === "/support") {
                      return (
                        <button key={idx} onClick={() => setMode("supportList")} className={commonClasses}>
                          {item.name} <ChevronRight />
                        </button>
                      );
                    }

                    if (item.link === "/transmissions") {
                      return (
                        <button key={idx} onClick={() => setMode("transmissionsList")} className={commonClasses}>
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

              {/* Transmissions submenu */}
              {mode === "transmissionsList" && (
                <div>
                  <button onClick={goBack} className="mb-4 flex items-center gap-2 text-lg">
                    <FaTimes /> Back
                  </button>
                  {translatedMenuItems
                    .find(item => item.link === "/transmissions")
                    ?.subLinks?.map(sub => {
                      if (typeof sub === "string") {
                        return (
                          <Link key={sub} href={`/transmissions/${toSlug(sub)}`} onClick={() => setIsSidebarOpen(false)} className="block ml-4 py-2 border-b border-gray-200 hover:text-black">
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
              <Link
                onClick={() => setIsSidebarOpen(false)}
                href="/profile"
                className="ml-3 text-lg  !text-black hover:!text-red-800 upper-case"
              >
                {translatedTexts.login}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
