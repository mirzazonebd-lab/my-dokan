'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight, ShoppingBag, Star, Clock } from 'lucide-react';
import { getFlashSaleProducts } from '@/lib/data/products';

function useCountdown(targetHours = 8) {
  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: 23,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds =
          prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 8, minutes: 0, seconds: 0 };
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#1C1C2E] text-white w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold font-poppins tabular-nums shadow-inner">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function FlashSale() {
  const products = getFlashSaleProducts();
  const timeLeft = useCountdown(8);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#C4818A]/15 rounded-xl flex items-center justify-center flash-badge">
                <Zap size={20} className="text-[#C4818A] fill-[#C4818A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#C4818A] uppercase tracking-widest">
                    Limited Time
                  </span>
                </div>
                <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E]">
                  Flash <span className="text-[#C4818A]">Sale</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock size={14} />
              <span className="hidden sm:inline">Ends in:</span>
            </div>
            <div className="flex items-center gap-2">
              <CountdownUnit value={timeLeft.hours} label="HRS" />
              <span className="text-xl font-bold text-[#C4818A] pb-4">:</span>
              <CountdownUnit value={timeLeft.minutes} label="MIN" />
              <span className="text-xl font-bold text-[#C4818A] pb-4">:</span>
              <CountdownUnit value={timeLeft.seconds} label="SEC" />
            </div>
          </div>
        </div>

        {/* Products Scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product, i) => {
            const discount = product.discountPercent || 0;
            const savings = product.originalPrice
              ? product.originalPrice - product.price
              : 0;

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white border border-rose-100 hover:border-[#C4818A] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-rose-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {/* Flash badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-[#C4818A] text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Zap size={9} fill="currentColor" />
                      -{discount}%
                    </span>
                  </div>
                  {/* Cart button on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#1C1C2E] text-white text-xs font-semibold py-2 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5">
                    <ShoppingBag size={12} />
                    Add to Cart
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-[10px] font-semibold text-[#C4818A] mb-0.5">{product.brand}</p>
                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] text-gray-500">
                      {product.rating} ({product.totalReviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm font-bold text-[#1C1C2E]">
                      ৳{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-gray-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                    {savings > 0 && (
                      <p className="text-[10px] text-green-600 font-medium">
                        Save ৳{savings.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <Link
            href="/flash-sale"
            className="inline-flex items-center gap-2 border-2 border-[#C4818A] text-[#C4818A] hover:bg-[#C4818A] hover:text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300"
          >
            <Zap size={16} />
            View All Flash Sale Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
