'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/app/context/WishlistContext';
import { useLanguage } from '@/app/context/LanguageContext';

type Product = {
  id: string;
  name: Record<string, string>; // multilingual names
  price: number;
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  slug: Record<string, string>; // multilingual slugs
};

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToWishlist } = useWishlist();
  const { translate, language } = useLanguage();
const currentLang = language || 'en';  // fallback to 'en' if undefined


  const [translatedTexts, setTranslatedTexts] = useState({
    title: 'Best-Selling Engine Components',
   description: `Premium quality engine parts sourced from trusted manufacturers.\nExperience performance and reliability with every component.`,
    addtoCart: 'Add to Cart',
    addtoWishlist: 'Add to Wishlist',
  });

  // Translate static UI texts when language changes
  useEffect(() => {
    async function translateTexts() {
      const translatedTitle = await translate("Best-Selling Engine Components");
      const translatedDescription = await translate("Premium quality engine parts sourced from trusted manufacturers.\nExperience performance and reliability with every component.");
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
        const res = await fetch('/api/products?limit=8');
        const { data } = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch edible products:', error);
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
  const [hovered, setHovered] = useState(false);

  // Pick slug and name for current language, fallback to English
  const slugForLang = product.slug?.[currentLang] || product.slug?.en || '';
  const nameForLang = product.name?.[currentLang] || product.name?.en || '';

  return (
    <div
      className="relative group flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${slugForLang}`}>
        <div className="w-full aspect-square relative overflow-hidden">
          
          <Image
            src={product.mainImage}
            alt={nameForLang}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-blue-500 transition-colors">
                {translatedTexts.addtoCart}
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 text-center">
        <Link href={`/products/${slugForLang}`}>
          <h3 className="text-lg font-semibold hover:underline">{nameForLang}</h3>
        </Link>
        <p className="text-gray-600 mt-1">${product.price}</p>

        <button
          className="mt-2 bg-white border border-black text-black px-4 py-1 rounded-full shadow-sm hover:bg-black hover:text-white transition-colors"
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
          {translatedTexts.addtoWishlist}
        </button>
      </div>
    </div>
  );
}





