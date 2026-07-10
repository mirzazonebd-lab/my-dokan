'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, CreditCard as Edit, Trash2, Globe, Sparkles } from 'lucide-react';
import { brands as brandsData } from '@/lib/data/brands';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminBrandsPage() {
  const [brands] = useState(brandsData);

  const koreanBrands = brands.filter(b => b.isKorean);
  const internationalBrands = brands.filter(b => !b.isKorean);

  return (
    <AdminLayout activeTab="brands">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-500">{brands.length} brands</p>
          </div>
          <Button className="bg-[#C4818A] hover:bg-[#B06E77]">
            <Plus size={16} className="mr-1" />
            Add Brand
          </Button>
        </div>

        {/* Korean Brands */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-rose-500" size={20} />
            <h2 className="text-lg font-semibold">Korean Brands ({koreanBrands.length})</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {koreanBrands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* International Brands */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold">International Brands ({internationalBrands.length})</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {internationalBrands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function BrandCard({ brand }: { brand: typeof brandsData[0] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          className="object-cover"
        />
        {brand.country === 'South Korea' && (
          <span className="absolute top-2 right-2 text-sm">🇰🇷</span>
        )}
        {brand.country === 'USA' && (
          <span className="absolute top-2 right-2 text-sm">🇺🇸</span>
        )}
        {brand.country === 'France' && (
          <span className="absolute top-2 right-2 text-sm">🇫🇷</span>
        )}
        {brand.country === 'Canada' && (
          <span className="absolute top-2 right-2 text-sm">🇨🇦</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{brand.name}</h3>
          {brand.featured && (
            <span className="text-xs px-2 py-0.5 bg-champagne-100 text-champagne-700 rounded-full">
              Featured
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">{brand.country}</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{brand.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{brand.productCount || 0} products</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm"><Edit size={14} /></Button>
            <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
