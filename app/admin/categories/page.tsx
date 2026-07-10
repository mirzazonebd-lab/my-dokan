'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, CreditCard as Edit, Trash2, Package } from 'lucide-react';
import { categories as categoriesData } from '@/lib/data/categories';
import { products } from '@/lib/data/products';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminCategoriesPage() {
  const [categories] = useState(categoriesData);

  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <AdminLayout activeTab="categories">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500">{categories.length} categories</p>
          </div>
          <Button className="bg-[#C4818A] hover:bg-[#B06E77]">
            <Plus size={16} className="mr-1" />
            Add Category
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-2xl">{category.icon}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {getProductCount(category.name)} products
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">/{category.slug}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><Edit size={14} /></Button>
                    <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
