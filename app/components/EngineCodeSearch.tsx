'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';


type Product = {
  _id: string;
  name: string;
  slug: string;
};

const EngineCodeSearch = ({ products }: { products: Product[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  return (
    <div className="mb-6">
      <input
  type="text"
  placeholder="Search engine code..."
  value={searchTerm}
  onChange={e => setSearchTerm(e.target.value)}
  className="mb-4 px-3 py-2 border rounded w-full"
/>


      {searchTerm && (
        <ul className="bg-white shadow rounded p-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <li key={product._id} className="mb-2">
                <Link href={`/products/${product.slug}`} className="text-blue-600 hover:underline">
                  {product.name}
                </Link>
              </li>
            ))
          ) : (
            <li>No results found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default EngineCodeSearch;
