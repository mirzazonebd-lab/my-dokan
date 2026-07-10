'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, CircleCheck as CheckCircle2, Plus, Minus, Zap } from 'lucide-react';
import { Product } from '@/lib/data/types';

interface ProductListCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductListCard({ product, onQuickView }: ProductListCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount = product.discountPercent
    ? product.discountPercent
    : product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group bg-white border border-gray-100 hover:border-rose-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative w-full sm:w-52 md:w-64 aspect-square sm:aspect-auto flex-shrink-0 bg-rose-50 overflow-hidden">
        <Image
          src={imageError ? 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=500' : product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, 256px"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-[#C4818A] text-white text-[10px] font-bold rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge === 'New' && (
            <span className="px-2 py-0.5 bg-[#1C1C2E] text-white text-[10px] font-bold rounded-full">
              NEW
            </span>
          )}
          {product.badge === 'Sale' && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <Zap size={8} fill="currentColor" />
              SALE
            </span>
          )}
          {product.category === 'Korean Skincare' && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
              K-Beauty
            </span>
          )}
        </div>

        {/* Wishlist on hover */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
            wishlisted
              ? 'bg-[#C4818A] text-white opacity-100'
              : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-[#C4818A] hover:text-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Main Info */}
          <div className="flex-1">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-[#C4818A] uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-[11px] text-gray-400">{product.category}</span>
            </div>

            {/* Name */}
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-[#1C1C2E] text-base leading-snug hover:text-[#C4818A] transition-colors mb-2 line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < Math.round(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.totalReviews.toLocaleString()})</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {product.shortDescription}
            </p>

            {/* Skin Type */}
            {product.skinType && (
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="text-[10px] px-2 py-0.5 bg-rose-50 text-[#C4818A] rounded-full border border-rose-100"
                >
                  {product.skinType}
                </span>
              </div>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:min-w-[180px]">
            {/* Price */}
            <div className="text-right">
              <p className="text-xl font-bold text-[#1C1C2E]">
                ৳{product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </p>
              )}
              {discount > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  Save ৳{((product.originalPrice || product.price) - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'in_stock' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-[11px] text-gray-400">
                {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-7 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full sm:min-w-[140px]">
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out_of_stock'}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 w-full ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.stockStatus === 'out_of_stock'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#1C1C2E] hover:bg-[#2D2D44] text-white hover:-translate-y-0.5'
                }`}
              >
                <ShoppingBag size={14} />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
              <Link
                href={`/product/${product.id}`}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-[#C4818A] text-[#C4818A] hover:bg-[#C4818A] hover:text-white transition-all duration-300 w-full text-center"
              >
                Buy Now
              </Link>
              <button
                onClick={() => onQuickView(product)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs text-gray-500 hover:text-[#C4818A] border border-gray-200 hover:border-[#C4818A] transition-colors w-full"
              >
                <Eye size={13} />
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
