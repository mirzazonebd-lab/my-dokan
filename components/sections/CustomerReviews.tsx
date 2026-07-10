'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedReviews } from '@/lib/data/reviews';

export default function CustomerReviews() {
  const reviews = getFeaturedReviews();
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i === 0 ? reviews.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === reviews.length - 1 ? 0 : i + 1));

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E] mb-3">
            What Customers <span className="text-[#C4818A]">Say</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-500 text-sm">4.8 from 10,000+ reviews</span>
          </div>
        </div>

        {/* Featured Review */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-rose-50 rounded-2xl p-8 md:p-10 text-center">
            <div className="flex justify-center gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-lg md:text-xl text-[#1C1C2E] leading-relaxed mb-6">
              &quot;{reviews[activeIndex].comment.slice(0, 200)}...&quot;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={reviews[activeIndex].userAvatar}
                  alt={reviews[activeIndex].userName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#1C1C2E]">{reviews[activeIndex].userName}</p>
                <p className="text-sm text-gray-500">{reviews[activeIndex].location}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#C4818A] hover:text-[#C4818A] flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {reviews.slice(0, 6).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? 'w-6 bg-[#C4818A]' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#C4818A] hover:text-[#C4818A] flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
