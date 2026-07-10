'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Heart, ShoppingBag, ArrowRight, Plus, Minus, Shield, Truck, CircleCheck as CheckCircle2, Package } from 'lucide-react';
import { Product } from '@/lib/data/types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:border-rose-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square sm:rounded-l-3xl overflow-hidden bg-rose-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.discountPercent && (
                <span className="px-2.5 py-1 bg-[#C4818A] text-white text-xs font-bold rounded-full">
                  -{product.discountPercent}% OFF
                </span>
              )}
              {product.badge === 'New' && (
                <span className="px-2.5 py-1 bg-[#1C1C2E] text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              )}
              {product.category === 'Korean Skincare' && (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                  🇰🇷 K-Beauty
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#C4818A] uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{product.category}</span>
            </div>

            {/* Name */}
            <h2 className="font-poppins text-lg font-bold text-[#1C1C2E] leading-tight mb-3">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1C1C2E]">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.totalReviews.toLocaleString()} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
              {product.shortDescription}
            </p>

            {/* Skin Type */}
            {product.skinType && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="px-2 py-0.5 bg-rose-50 text-[#C4818A] text-[11px] rounded-full border border-rose-200">
                  {product.skinType}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-2xl font-bold text-[#1C1C2E]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save ৳{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-2 h-2 rounded-full ${product.stockStatus === 'in_stock' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs font-medium text-gray-500">
                {product.stockStatus === 'in_stock'
                  ? 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Qty Selector */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-rose-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-rose-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out_of_stock'}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1C1C2E] hover:bg-[#2D2D44] text-white hover:-translate-y-0.5'
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 size={15} /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                  wishlisted
                    ? 'bg-rose-50 border-[#C4818A] text-[#C4818A]'
                    : 'border-gray-200 text-gray-500 hover:border-[#C4818A] hover:text-[#C4818A]'
                }`}
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#C4818A] text-[#C4818A] hover:bg-[#C4818A] hover:text-white font-semibold text-sm transition-all duration-300 mb-5"
            >
              Buy Now
              <ArrowRight size={15} />
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
              {[
                { icon: Shield, text: 'Authentic' },
                { icon: Truck, text: 'Fast Delivery' },
                { icon: Package, text: 'Easy Return' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1">
                  <Icon size={16} className="text-[#C4818A]" />
                  <span className="text-[10px] text-gray-400">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
