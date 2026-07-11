'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { useCart } from '@/components/cart/CartStore';
import { useCompare } from '@/components/CompareDrawer';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'grid' | 'list';
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, variant = 'default', onQuickView }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const { addItem } = useCart();
  const { isInCompare, add, remove } = useCompare();

  const layoutMode = variant === 'grid' ? 'default' : variant === 'list' ? 'list' : variant;

  const discountPct = product.discountPercent
    ? product.discountPercent
    : product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addItem(product, 1);
    setIsAdding(false);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(product.id)) {
      remove(product.id);
    } else {
      add(product);
    }
  };

  // List view layout
  if (layoutMode === 'list') {
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex gap-4 p-4">
        <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-rose-50">
          <Image
            src={imageError ? 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=500' : product.image}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
          {discountPct > 0 && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#C4818A] text-white text-[9px] font-bold rounded-full">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-[#C4818A] uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-gray-800 hover:text-[#C4818A] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < Math.round(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.totalReviews})</span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">{product.shortDescription}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[#1C1C2E]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isWishlisted ? 'bg-[#C4818A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-100'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out_of_stock'}
                className="px-3 py-1.5 bg-[#1C1C2E] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D44] transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showAdded ? (
                  <>
                    <Check size={12} />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-rose-50">
        <Image
          src={imageError ? 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=500' : product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discountPct > 0 && (
            <span className="px-2 py-0.5 bg-[#C4818A] text-white text-[10px] font-bold rounded-full shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.badge === 'New' && (
            <span className="px-2 py-0.5 bg-[#1C1C2E] text-white text-[10px] font-bold rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.badge === 'Best Seller' && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-sm">
              HOT
            </span>
          )}
          {product.category === 'Korean Skincare' && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200 shadow-sm">
              K-Beauty
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isWishlisted
                ? 'bg-[#C4818A] text-white'
                : 'bg-white text-gray-600 hover:bg-[#C4818A] hover:text-white'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onQuickView?.(product); }}
            className="w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-[#C4818A] hover:text-white flex items-center justify-center shadow-lg transition-colors"
            aria-label="Quick view"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={handleToggleCompare}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isInCompare(product.id)
                ? 'bg-[#C4818A] text-white'
                : 'bg-white text-gray-600 hover:bg-[#C4818A] hover:text-white'
            }`}
            aria-label={isInCompare(product.id) ? 'Remove from compare' : 'Add to compare'}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current strokeWidth={2}">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6v6m0 0H3m6 0l3-3m3 3h4a2 2 0 002-2v-4m-6 6v-6m0 0h6m-6 0l-3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockStatus === 'out_of_stock' || isAdding}
          className="absolute bottom-0 left-0 right-0 bg-[#1C1C2E] text-white text-xs font-semibold py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {showAdded ? (
            <>
              <Check size={14} />
              Added to Cart
            </>
          ) : isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : product.stockStatus === 'out_of_stock' ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3.5">
        <p className="text-[10px] font-semibold text-[#C4818A] uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#C4818A] transition-colors leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.round(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200 fill-gray-200'
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.totalReviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#1C1C2E]">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.stockStatus === 'in_stock' && (
            <span className="text-[10px] text-orange-500 font-medium animate-pulse">
              Limited stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
