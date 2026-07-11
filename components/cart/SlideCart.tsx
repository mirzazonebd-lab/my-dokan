'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/components/cart/CartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface SlideCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SlideCart({ open, onOpenChange }: SlideCartProps) {
  const { items, loading, updateQuantity, removeItem, subtotal, shipping, total } = useCart();

  const FREE_SHIPPING_THRESHOLD = 1500;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-gray-100">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#C4818A]" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-[#C4818A]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link href="/shop" className="flex items-center gap-2">
                Start Shopping <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            {remainingForFreeShipping > 0 && (
              <div className="p-4 bg-champagne-50 border-b border-champagne-100">
                <div className="flex items-center gap-2 text-sm text-champagne-700 mb-2">
                  <Sparkles size={14} />
                  <span>Add <strong>৳{remainingForFreeShipping}</strong> more for FREE shipping!</span>
                </div>
                <div className="h-2 bg-champagne-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-champagne-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(item => (
                <div key={item.product_id} className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-rose-50">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#C4818A] font-medium">{item.product.brand}</p>
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="text-sm font-medium text-gray-900 hover:text-[#C4818A] line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm font-semibold text-gray-900 mt-1">৳{item.product.price}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `৳${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#C4818A] hover:bg-[#B06E77] text-white"
                asChild
              >
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  Proceed to Checkout
                </Link>
              </Button>


            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
