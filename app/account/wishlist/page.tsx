'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartStore';
import { products } from '@/lib/data/products';
import AccountLayout from '../AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';

interface WishlistItemWithProduct {
  id: string;
  product_id: string;
  product: typeof products[0];
}

const WISHLIST_STORAGE_KEY = 'beautydokanbd_wishlist';

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState<WishlistItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (storedWishlist) {
      const parsed = JSON.parse(storedWishlist);
      const itemsWithProducts = parsed.map((item: { id: string; product_id: string }) => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) return null;
        return {
          id: item.id,
          product_id: item.product_id,
          product
        };
      }).filter(Boolean) as WishlistItemWithProduct[];
      setWishlist(itemsWithProducts);
    }
    setLoading(false);
  }, [user]);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated.map(i => ({ id: i.id, product_id: i.product_id }))));
  };

  const addToCart = (product: typeof products[0]) => {
    addItem(product, 1);
  };

  return (
    <ClientWrapper>
      <AccountLayout activeTab="wishlist">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Heart size={24} className="text-[#C4818A]" />
          My Wishlist ({wishlist.length})
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#C4818A] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-4">Save items you love for later.</p>
            <Button asChild className="bg-[#C4818A] hover:bg-[#B06E77]">
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map(item => (
              <div
                key={item.id}
                className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/product/${item.product_id}`}>
                  <div className="relative aspect-square bg-rose-50">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs text-[#C4818A]">{item.product.brand}</p>
                  <Link
                    href={`/product/${item.product_id}`}
                    className="font-medium text-sm line-clamp-2 hover:text-[#C4818A]"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold">৳{item.product.price.toLocaleString()}</p>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item.product)}
                      className="bg-[#C4818A] hover:bg-[#B06E77]"
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
