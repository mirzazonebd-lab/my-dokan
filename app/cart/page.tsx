'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/CartStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { ChevronRight, Minus, Plus } from 'lucide-react';

function CartPageContent() {
  const { items, subtotal, shipping, total, updateQuantity, removeItem, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white border border-gray-100 p-10 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-3">Loading your cart…</p>
            <p className="text-gray-500">Please wait while we restore your saved items.</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">Shopping Cart</p>
            <h1 className="text-3xl font-semibold text-[#1C1C2E]">Your Cart</h1>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C4818A] hover:text-[#B06E77]">
            Continue Shopping
            <ChevronRight size={16} />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-100 p-10 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-3">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Add products from the shop to review them here.</p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.7fr_0.8fr] gap-8">
            <section className="space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6">
                {items.map(item => (
                  <div key={item.product_id} className="grid grid-cols-[auto_1fr] gap-4 items-start">
                    <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-rose-50">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <Link href={`/product/${item.product.slug}`} className="text-lg font-semibold text-[#1C1C2E] hover:text-[#C4818A] transition-colors line-clamp-2">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mt-1">
                            {item.product.brand}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product_id)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">৳{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>

                      <p className="text-sm text-gray-500">Unit price: ৳{item.product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Need help?</h2>
                <p className="text-sm text-gray-500">If you have questions about your order, please contact our support team at 01712-012737.</p>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `৳${shipping}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold text-[#1C1C2E]">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <Button asChild className="w-full bg-[#C4818A] hover:bg-[#B06E77] text-white">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <ClientWrapper>
      <CartPageContent />
    </ClientWrapper>
  );
}
