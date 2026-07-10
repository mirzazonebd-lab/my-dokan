'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Package, ChevronRight, Globe, Sparkles } from 'lucide-react';
import { Brand } from '@/lib/data/types';
import { Input } from '@/components/ui/input';

interface Props {
  koreanBrands: Brand[];
  internationalBrands: Brand[];
}

export default function BrandsClient({ koreanBrands, internationalBrands }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'korean' | 'international'>('all');

  const filterBrands = (brands: Brand[]) => {
    if (!searchQuery) return brands;
    return brands.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredKorean = filterBrands(koreanBrands);
  const filteredInternational = filterBrands(internationalBrands);

  const allBrands = [...filteredKorean, ...filteredInternational];
  const featuredBrands = allBrands.filter(b => b.featured);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#1C1C2E] via-[#2D1B2E] to-[#1C1C2E] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4818A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-champagne-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1 text-white/60 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Brands</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-jakarta">
            Shop by Brand
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Discover authentic Korean beauty brands and trusted international skincare — all in one place.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:ring-2 focus:ring-[#C4818A]/50 focus:border-[#C4818A]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRegion === 'all'
                  ? 'bg-[#C4818A] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              All Brands ({koreanBrands.length + internationalBrands.length})
            </button>
            <button
              onClick={() => setSelectedRegion('korean')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedRegion === 'korean'
                  ? 'bg-[#C4818A] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Sparkles size={14} /> K-Beauty ({koreanBrands.length})
            </button>
            <button
              onClick={() => setSelectedRegion('international')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedRegion === 'international'
                  ? 'bg-[#C4818A] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Globe size={14} /> International ({internationalBrands.length})
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Brands */}
        {(selectedRegion === 'all' || !searchQuery) && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-jakarta flex items-center gap-2">
              <Star size={20} className="text-champagne-500 fill-champagne-500" />
              Featured Brands
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredBrands.slice(0, 12).map(brand => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>
        )}

        {/* Korean Brands Section */}
        {(selectedRegion === 'all' || selectedRegion === 'korean') && filteredKorean.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-jakarta flex items-center gap-2">
                <Sparkles size={20} className="text-rose-500" />
                Korean Brands
              </h2>
              <span className="text-sm text-gray-500">{filteredKorean.length} brands</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredKorean.map(brand => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>
        )}

        {/* International Brands Section */}
        {(selectedRegion === 'all' || selectedRegion === 'international') && filteredInternational.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-jakarta flex items-center gap-2">
                <Globe size={20} className="text-blue-500" />
                International Brands
              </h2>
              <span className="text-sm text-gray-500">{filteredInternational.length} brands</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredInternational.map(brand => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {allBrands.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600 mb-4">Try a different search term</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className="group relative bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:border-rose-200"
    >
      {/* Country Badge */}
      <span className="absolute top-3 right-3 text-xs text-gray-400 flex items-center gap-1">
        {brand.isKorean ? '🇰🇷' : brand.country === 'USA' ? '🇺🇸' : brand.country === 'France' ? '🇫🇷' : brand.country === 'Germany' ? '🇩🇪' : brand.country === 'Canada' ? '🇨🇦' : '🌐'}
      </span>

      {/* Logo */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Brand Info */}
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-[#C4818A] transition-colors text-center">
          {brand.name}
        </h3>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
          <Package size={12} />
          <span>{brand.productCount || 0} products</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </Link>
  );
}
