'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Heart, ShoppingCart, Minus, Plus, GitCompare, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/CartStore';

interface QuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickView({ product, open, onOpenChange }: QuickViewProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    onOpenChange(false);
  };

  const inStock = product.stockStatus === 'in_stock';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogClose className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <X size={18} />
        </DialogClose>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Images */}
          <div className="p-6 bg-gray-50">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails from gallery */}
            {product.gallery.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {product.gallery.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#C4818A]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <div className="relative w-full h-full bg-gray-200">
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6">
            <Link href={`/brand/${product.brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-[#C4818A] font-medium hover:underline">
              {product.brand}
            </Link>

            <Link href={`/product/${product.slug}`}>
              <h2 className="text-xl font-bold text-gray-900 mt-1 hover:text-[#C4818A] transition-colors">
                {product.name}
              </h2>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.totalReviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {inStock ? (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-4 line-clamp-3">
              {product.shortDescription}
            </p>

            {/* Skin Type */}
            {product.skinType && (
              <div className="mt-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Suitable for</span>
                <span className="text-xs px-2 py-1 ml-2 bg-gray-100 rounded-full text-gray-600">
                  {product.skinType}
                </span>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 bg-[#C4818A] hover:bg-[#B06E77] disabled:opacity-50"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Heart size={18} />
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <GitCompare size={18} />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={18} className="text-green-600" />
                <span>Free delivery on orders over ৳1,500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield size={18} className="text-blue-600" />
                <span>100% Authentic products guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw size={18} className="text-orange-600" />
                <span>7-day easy return policy</span>
              </div>
            </div>

            {/* View Full Details */}
            <Link
              href={`/product/${product.slug}`}
              className="mt-6 block text-center text-sm text-[#C4818A] font-medium hover:underline"
              onClick={() => onOpenChange(false)}
            >
              View Full Product Details
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
