'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, SlidersHorizontal, Grid3x3 as Grid3X3, List, ChevronDown, ChevronRight, X, Star, Package, Sparkles, MapPin, Globe, Award, TrendingUp } from 'lucide-react';
import { Brand, Product } from '@/lib/data/types';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface Props {
  brand: Brand;
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

export default function BrandClient({ brand, products: initialProducts }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category));
    return Array.from(cats);
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory.length > 0) {
      result = result.filter(p => selectedCategory.includes(p.category));
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stockStatus === 'in_stock');
    }

    // New products filter
    if (isNew) {
      result = result.filter(p => p.badge === 'New');
    }

    // On sale filter
    if (onSale) {
      result = result.filter(p => p.discountPercent && p.discountPercent > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
        break;
      case 'bestselling':
        result.sort((a, b) => (b.badge === 'Best Seller' ? 1 : 0) - (a.badge === 'Best Seller' ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.badge === 'Best Seller' ? 1 : 0) - (a.badge === 'Best Seller' ? 1 : 0));
    }

    return result;
  }, [initialProducts, selectedCategory, priceRange, minRating, inStockOnly, isNew, onSale, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearAllFilters = () => {
    setSelectedCategory([]);
    setPriceRange([0, 10000]);
    setMinRating(0);
    setInStockOnly(false);
    setIsNew(false);
    setOnSale(false);
    setCurrentPage(1);
  };

  const activeFilterCount = selectedCategory.length +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (isNew ? 1 : 0) +
    (onSale ? 1 : 0);

  // Stats
  const avgRating = initialProducts.length > 0
    ? (initialProducts.reduce((sum, p) => sum + p.rating, 0) / initialProducts.length).toFixed(1)
    : '0.0';
  const totalReviews = initialProducts.reduce((sum, p) => sum + p.totalReviews, 0);
  const bestSellers = initialProducts.filter(p => p.badge === 'Best Seller').length;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      {availableCategories.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Category</h4>
          <div className="space-y-2">
            {availableCategories.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={selectedCategory.includes(cat)}
                  onCheckedChange={(checked) => {
                    setSelectedCategory(prev =>
                      checked ? [...prev, cat] : prev.filter(c => c !== cat)
                    );
                    setCurrentPage(1);
                  }}
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {cat}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  ({initialProducts.filter(p => p.category === cat).length})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value as number[]);
              setCurrentPage(1);
            }}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>৳{priceRange[0]}</span>
            <span>৳{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Rating</h4>
        <div className="flex gap-2 flex-wrap">
          {[4.5, 4, 3.5, 3].map(rating => (
            <button
              key={rating}
              onClick={() => {
                setMinRating(minRating === rating ? 0 : rating);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors ${
                minRating === rating
                  ? 'bg-[#C4818A] text-white'
                  : 'bg-gray-100 hover:bg-rose-100'
              }`}
            >
              <Star size={12} className={minRating === rating ? 'fill-white' : 'fill-yellow-400 text-yellow-400'} />
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Quick Filters</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={inStockOnly}
              onCheckedChange={(checked) => {
                setInStockOnly(checked as boolean);
                setCurrentPage(1);
              }}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
              <Package size={14} /> In Stock Only
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={isNew}
              onCheckedChange={(checked) => {
                setIsNew(checked as boolean);
                setCurrentPage(1);
              }}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
              <Sparkles size={14} /> New Arrivals
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={onSale}
              onCheckedChange={(checked) => {
                setOnSale(checked as boolean);
                setCurrentPage(1);
              }}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
              <TrendingUp size={14} /> On Sale
            </span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2 text-sm text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1"
        >
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <main>
      {/* Brand Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#1C1C2E] via-[#2D1B2E] to-[#1C1C2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4818A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-champagne-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/brands" className="hover:text-white">Brands</Link>
            <ChevronRight size={14} />
            <span className="text-white">{brand.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Brand Logo */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm flex-shrink-0 border border-white/20">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Brand Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white font-jakarta">
                  {brand.name}
                </h1>
                {brand.isKorean && (
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-medium flex items-center gap-1">
                    <Sparkles size={12} /> K-Beauty
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-white/70 mb-4">
                <MapPin size={16} />
                <span>{brand.country}</span>
                {brand.featured && (
                  <>
                    <span>•</span>
                    <Award size={16} className="text-champagne-400" />
                    <span className="text-champagne-400">Featured Brand</span>
                  </>
                )}
              </div>

              <p className="text-white/80 max-w-2xl mb-6">
                {brand.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="bg-white/10 rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-white">{initialProducts.length}</div>
                  <div className="text-sm text-white/60">Products</div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-white flex items-center gap-1">
                    <Star size={18} className="fill-yellow-400 text-yellow-400" />
                    {avgRating}
                  </div>
                  <div className="text-sm text-white/60">Avg Rating</div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-white">{totalReviews.toLocaleString()}</div>
                  <div className="text-sm text-white/60">Reviews</div>
                </div>
                {bestSellers > 0 && (
                  <div className="bg-white/10 rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold text-white">{bestSellers}</div>
                    <div className="text-sm text-white/60">Best Sellers</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
                {activeFilterCount > 0 && (
                  <span className="bg-[#C4818A] text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex items-center gap-2">
                      <Filter size={16} />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="bg-[#C4818A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal size={18} /> Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-gray-600">
                  {filteredProducts.length} products
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#C4818A]/20 focus:border-[#C4818A] outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="bestselling">Best Selling</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                  : 'space-y-4'
              }>
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#C4818A] text-white'
                            : 'bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
