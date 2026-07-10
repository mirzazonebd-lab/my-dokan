'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import QuickView from '@/components/QuickView';
import { getBestSellers, getNewArrivals, getFeaturedProducts } from '@/lib/data/products';
import { Product } from '@/lib/data/types';

const tabs = [
  { id: 'best', label: 'Best Sellers', fn: getBestSellers },
  { id: 'new', label: 'New Arrivals', fn: getNewArrivals },
  { id: 'featured', label: 'Featured', fn: getFeaturedProducts },
];

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState('best');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const activeTabData = tabs.find(t => t.id === activeTab);
  const products = activeTabData ? activeTabData.fn().slice(0, 8) : [];

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  return (
    <>
      <section className="py-20 bg-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E] mb-3">
              Featured <span className="text-[#C4818A]">Products</span>
            </h2>
            <p className="text-gray-500">Hand-picked favorites from our collection</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C4818A] text-white'
                    : 'bg-white text-gray-600 hover:text-[#C4818A] border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#1C1C2E] hover:bg-[#2D2D44] text-white px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <QuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
