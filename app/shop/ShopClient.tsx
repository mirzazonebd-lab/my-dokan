'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, Grid3x3 as Grid3X3, List, ChevronLeft, ChevronRight, X, ArrowUpDown, Package, Heart, Eye, ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { products } from '@/lib/data/products';
import { Product } from '@/lib/data/types';

type SortKey =
  | 'featured'
  | 'bestselling'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest'
  | 'name-asc'
  | 'discount-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount-desc', label: 'Biggest Discount' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

const PAGE_SIZE_GRID = 12;
const PAGE_SIZE_LIST = 8;

const CATEGORIES = ['Korean Skincare', 'Makeup', 'Hair Care', 'Body Care', "Men's Grooming"];
const BRANDS = ['COSRX', 'Beauty of Joseon', 'Anua', 'SKIN1004', 'Axis-Y', 'Round Lab', 'Some By Mi', 'Torriden'];

interface FilterState {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  inStockOnly: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 5000,
  rating: 0,
  inStockOnly: false,
};

function applyFilters(all: Product[], filters: FilterState, query: string): Product[] {
  return all.filter(p => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (filters.rating > 0 && p.rating < filters.rating) return false;
    if (filters.inStockOnly && p.stockStatus !== 'in_stock') return false;
    return true;
  });
}

function applySort(list: Product[], sort: SortKey): Product[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating-desc': return b.rating - a.rating || b.totalReviews - a.totalReviews;
      case 'newest': return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
      case 'bestselling': return (b.badge === 'Best Seller' ? 1 : 0) - (a.badge === 'Best Seller' ? 1 : 0);
      case 'discount-desc': return (b.discountPercent || 0) - (a.discountPercent || 0);
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return (b.badge === 'Best Seller' ? 1 : 0) - (a.badge === 'Best Seller' ? 1 : 0);
    }
  });
}

// Instant search results component
function SearchDropdown({ query, onClose }: { query: string; onClose: () => void }) {
  if (query.length < 2) return null;

  const q = query.toLowerCase();
  const matchedProducts = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 5);

  const matchedCategories = CATEGORIES.filter(c => c.toLowerCase().includes(q));
  const matchedBrands = BRANDS.filter(b => b.toLowerCase().includes(q));

  if (matchedProducts.length === 0 && matchedCategories.length === 0 && matchedBrands.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50">
        <p className="text-center text-gray-500 text-sm">No results for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
      {/* Categories & Brands */}
      {(matchedCategories.length > 0 || matchedBrands.length > 0) && (
        <div className="p-3 border-b border-gray-100">
          {matchedCategories.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedCategories.map(cat => (
                  <Link
                    key={cat}
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    onClick={onClose}
                    className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs hover:bg-[#C4818A] hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {matchedBrands.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Brands</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedBrands.map(brand => (
                  <Link
                    key={brand}
                    href={`/shop?brand=${encodeURIComponent(brand)}`}
                    onClick={onClose}
                    className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs hover:bg-[#C4818A] hover:text-white transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {matchedProducts.length > 0 && (
        <div>
          <p className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Products</p>
          <div className="divide-y divide-gray-50">
            {matchedProducts.map(product => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#C4818A] font-medium">{product.brand}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] text-gray-500">{product.rating}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#1C1C2E]">৳{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/shop?search=${encodeURIComponent(query)}`}
        onClick={onClose}
        className="block text-center py-2.5 text-sm text-[#C4818A] font-medium bg-gray-50 hover:bg-[#C4818A] hover:text-white transition-colors"
      >
        View all results ({products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).length})
      </Link>
    </div>
  );
}

export default function ShopClient() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortKey>('featured');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const pageSize = view === 'grid' ? PAGE_SIZE_GRID : PAGE_SIZE_LIST;

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => applyFilters(products, filters, query), [filters, query]);
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize],
  );

  const handleFilterChange = useCallback((f: FilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((s: SortKey) => {
    setSort(s);
    setPage(1);
  }, []);

  const handleViewChange = useCallback((v: 'grid' | 'list') => {
    setView(v);
    setPage(1);
  }, []);

  const goToPage = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 5000 ||
    filters.rating > 0 ||
    filters.inStockOnly;

  return (
    <>
      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto w-80 max-w-[90vw] h-full bg-white overflow-y-auto shadow-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#C4818A] font-medium">Shop</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-[#1C1C2E]">
                All Products
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {sorted.length} products {query && `for "${query}"`}
              </p>
            </div>
          </div>
        </div>

        {/* Search + Toolbar */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search with Instant Results */}
            <div className="relative flex-1" ref={searchRef}>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, brand, category..."
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4818A]/20 focus:border-[#C4818A]"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              )}
              {searchFocused && query.length >= 2 && (
                <SearchDropdown query={query} onClose={() => setSearchFocused(false)} />
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={15} className="text-gray-400" />
              <select
                value={sort}
                onChange={e => handleSortChange(e.target.value as SortKey)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer min-w-[160px]"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => handleViewChange('grid')}
                className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-[#C4818A]' : 'text-gray-400'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-[#C4818A]' : 'text-gray-400'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${hasActiveFilters ? 'bg-[#C4818A] text-white border-[#C4818A]' : 'border-gray-200 text-gray-600'}`}
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Filters</h3>
              <FilterPanel filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Products Area */}
          <main className="flex-1 min-w-0">
            {/* No Results */}
            {paginated.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-5">Try adjusting your filters</p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(''); }}
                  className="px-5 py-2.5 bg-[#C4818A] text-white rounded-xl text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Grid View */}
            {view === 'grid' && paginated.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {view === 'list' && paginated.length > 0 && (
              <div className="space-y-4">
                {paginated.map((product) => (
                  <ProductListCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && paginated.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-40 hover:border-[#C4818A] hover:text-[#C4818A]"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium ${page === pageNum ? 'bg-[#C4818A] text-white' : 'border text-gray-600 hover:border-[#C4818A]'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-40 hover:border-[#C4818A] hover:text-[#C4818A]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

// Filter Panel Component
function FilterPanel({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const toggleCategory = (cat: string) => {
    onChange({
      ...filters,
      categories: filters.categories.includes(cat)
        ? filters.categories.filter(c => c !== cat)
        : [...filters.categories, cat],
    });
  };

  const toggleBrand = (brand: string) => {
    onChange({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter(b => b !== brand)
        : [...filters.brands, brand],
    });
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-medium mb-3">Brands</h4>
        <div className="space-y-2">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            onChange={e => onChange({ ...filters, priceMin: Number(e.target.value) })}
            className="w-24 px-2 py-1.5 text-sm border rounded-lg"
            placeholder="Min"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={filters.priceMax}
            onChange={e => onChange({ ...filters, priceMax: Number(e.target.value) })}
            className="w-24 px-2 py-1.5 text-sm border rounded-lg"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium mb-3">Minimum Rating</h4>
        <div className="flex gap-1">
          {[4, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, rating: filters.rating === r ? 0 : r })}
              className={`px-3 py-1.5 rounded-lg text-sm ${filters.rating === r ? 'bg-[#C4818A] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={e => onChange({ ...filters, inStockOnly: e.target.checked })}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">In Stock Only</span>
      </label>

      {/* Clear */}
      <button
        onClick={() => onChange(DEFAULT_FILTERS)}
        className="w-full py-2 text-sm text-[#C4818A] border border-[#C4818A] rounded-xl hover:bg-[#C4818A] hover:text-white transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="relative aspect-square overflow-hidden bg-rose-50">
        <a href={`/product/${product.slug}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </a>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${
            product.badge === 'Best Seller' ? 'bg-amber-500 text-white' :
            product.badge === 'New' ? 'bg-[#1C1C2E] text-white' :
            product.badge === 'Sale' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {product.badge}
          </span>
        )}

        {/* Discount */}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#C4818A] text-white text-[10px] font-bold rounded-full">
            -{product.discountPercent}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow ${wishlisted ? 'bg-[#C4818A] text-white' : 'bg-white text-gray-600'}`}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full bg-white text-gray-600 flex items-center justify-center shadow hover:bg-[#C4818A] hover:text-white"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 translate-y-full group-hover:translate-y-0 transition-transform ${addedToCart ? 'bg-green-500 text-white' : 'bg-[#1C1C2E] text-white'}`}
        >
          {addedToCart ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Cart</>}
        </button>
      </div>

      <div className="p-3.5">
        <p className="text-[10px] font-semibold text-[#C4818A] uppercase tracking-wider mb-1">{product.brand}</p>
        <a href={`/product/${product.slug}`} className="block text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#C4818A] mb-2">
          {product.name}
        </a>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={11} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.totalReviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#1C1C2E]">৳{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* View Details */}
        <a
          href={`/product/${product.slug}`}
          className="mt-2.5 flex items-center justify-center w-full py-2 rounded-xl border border-[#C4818A] text-[#C4818A] text-xs font-semibold hover:bg-[#C4818A] hover:text-white transition-colors"
        >
          View Details
        </a>
      </div>
    </div>
  );
}

// Product List Card Component
function ProductListCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const [addedToCart, setAddedToCart] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex gap-4 p-4">
      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-rose-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C4818A] text-white text-[10px] font-bold rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-[#C4818A] uppercase">{product.brand}</p>
        <a href={`/product/${product.slug}`} className="block font-medium text-gray-800 hover:text-[#C4818A] mb-1">
          {product.name}
        </a>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={12} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
          ))}
          <span className="text-xs text-gray-400">({product.totalReviews})</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.shortDescription}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => onQuickView(product)}
            className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-[#C4818A] hover:text-[#C4818A]"
          >
            Quick View
          </button>
          <button
            onClick={() => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000); }}
            className={`px-4 py-1.5 text-sm rounded-lg ${addedToCart ? 'bg-green-500 text-white' : 'bg-[#1C1C2E] text-white'}`}
          >
            {addedToCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
