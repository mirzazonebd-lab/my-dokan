'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { brands } from '@/lib/data/brands';

interface LiveSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSearch({ isOpen, onClose }: LiveSearchProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('beautydokanbd_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const trendingSearches = ['COSRX', 'Laneige', 'Vitamin C', 'SPF50', 'Niacinamide'];

  const results = query.length > 1 ? {
    products: products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4),
    categories: categories.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    ),
    brands: brands.filter(b =>
      b.name.toLowerCase().includes(query.toLowerCase())
    ),
  } : null;

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('beautydokanbd_searches', JSON.stringify(updated));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute top-0 left-0 right-0 bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <Input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
              placeholder="Search for skincare, makeup, brands..."
              className="pl-12 pr-12 h-14 text-lg border-2 focus:border-[#C4818A]"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-6 max-h-[70vh] overflow-y-auto">
          {results ? (
            <div className="space-y-6">
              {results.categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.brands.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brands</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.brands.map(brand => (
                      <Link
                        key={brand.id}
                        href={`/brand/${brand.slug}`}
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products</h3>
                  <div className="space-y-2">
                    {results.products.map(product => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                        <p className="font-semibold text-[#C4818A]">৳{product.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length === 0 && results.categories.length === 0 && results.brands.length === 0 && (
                <p className="text-center text-gray-500 py-8">No results found for &quot;{query}&quot;</p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock size={12} /> Recent Searches
                </h3>
                {recentSearches.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                        className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-rose-100 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent searches</p>
                )}
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <TrendingUp size={12} /> Trending
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(search)}
                      className="px-3 py-1.5 bg-[#C4818A]/10 text-[#C4818A] rounded-lg text-sm hover:bg-[#C4818A]/20 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
