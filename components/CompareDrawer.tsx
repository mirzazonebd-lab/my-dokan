'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, GitCompare, Check, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface CompareContextType {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  canAdd: boolean;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const add = (product: Product) => {
    if (items.length >= MAX_COMPARE || items.some(p => p.id === product.id)) return;
    setItems(prev => [...prev, product]);
  };

  const remove = (productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => items.some(p => p.id === productId);
  const canAdd = items.length < MAX_COMPARE;
  const clear = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, add, remove, isInCompare, canAdd, clear }}>
      {children}
      <CompareDrawer />
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  // During SSR, context will be undefined - return a default safe state
  if (!context) {
    return {
      items: [],
      add: () => {},
      remove: () => {},
      isInCompare: () => false,
      canAdd: true,
      clear: () => {}
    };
  }
  return context;
}

function CompareDrawer() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1C1C2E] text-white p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitCompare size={20} className="text-[#C4818A]" />
          <span className="font-medium">Compare Products ({items.length})</span>
        </div>

        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {items.map(product => (
            <div
              key={product.id}
              className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
            >
              <div className="relative w-10 h-10 rounded overflow-hidden bg-white/20">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <span className="text-sm truncate max-w-[120px]">{product.name}</span>
              <button
                onClick={() => remove(product.id)}
                className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-red-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-[#C4818A] hover:bg-[#B06E77]">
                Compare Now
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Product Comparison</SheetTitle>
              </SheetHeader>
              <CompareTable />
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="sm" onClick={clear} className="text-white/70 hover:text-white">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

function CompareTable() {
  const { items } = useCompare();

  const features: { label: string; key: string; format: (v: unknown) => string }[] = [
    { label: 'Price', key: 'price', format: (v) => `৳${Number(v).toLocaleString()}` },
    { label: 'Rating', key: 'rating', format: (v) => `${Number(v)} ★` },
    { label: 'Reviews', key: 'totalReviews', format: (v) => Number(v).toLocaleString() },
    { label: 'Brand', key: 'brand', format: (v) => String(v) },
    { label: 'Category', key: 'category', format: (v) => String(v) },
  ];

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-3 font-medium text-gray-500">Feature</th>
            {items.map(p => (
              <th key={p.id} className="p-3 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <Link href={`/product/${p.slug}`} className="text-sm font-medium hover:text-[#C4818A]">
                    {p.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <tr key={feature.key} className="border-t border-gray-100">
              <td className="p-3 font-medium text-gray-600">{feature.label}</td>
              {items.map(p => (
                <td key={p.id} className="p-3 text-center">
                  <span className="font-medium">{feature.format(p[feature.key as keyof Product])}</span>
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-gray-100">
            <td className="p-3 font-medium text-gray-600">In Stock</td>
            {items.map(p => (
              <td key={p.id} className="p-3 text-center">
                {p.stockStatus === 'in_stock' ? (
                  <CheckCircle className="inline text-green-500" size={18} />
                ) : (
                  <XCircle className="inline text-red-500" size={18} />
                )}
              </td>
            ))}
          </tr>
          <tr className="border-t border-gray-100">
            <td className="p-3 font-medium text-gray-600">Skin Type</td>
            {items.map(p => (
              <td key={p.id} className="p-3 text-center text-sm">
                {p.skinType || 'All'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
