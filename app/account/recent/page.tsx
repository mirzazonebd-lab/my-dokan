'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, X } from 'lucide-react';
import AccountLayout from '../AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';

export default function RecentPage() {
  const recentlyViewed = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('beautydokanbd_recent') || '[]')
    : [];

  const clearHistory = () => {
    localStorage.removeItem('beautydokanbd_recent');
    window.location.reload();
  };

  return (
    <ClientWrapper>
      <AccountLayout activeTab="recent">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Clock size={24} className="text-[#C4818A]" />
            Recently Viewed ({recentlyViewed.length})
          </h1>
          {recentlyViewed.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          )}
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No browsing history</h3>
            <p className="text-gray-500">Products you view will appear here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.map((item: any) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-rose-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#C4818A]">{item.brand}</p>
                  <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                  <p className="font-semibold mt-1">৳{item.price?.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
