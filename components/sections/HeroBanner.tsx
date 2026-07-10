'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'Your Trusted Destination',
    headline: 'Premium Beauty Products',
    subheadline: 'Discover authentic global skincare, makeup, hair care, body care and men\'s grooming products—all in one place.',
    cta1: { label: 'Shop Now', href: '/shop' },
    cta2: { label: 'Explore Brands', href: '/brands' },
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 2,
    badge: 'K-Beauty Essentials',
    headline: 'Korean Skincare Revolution',
    subheadline: 'Experience the world-renowned 10-step Korean skincare routine with authentic products.',
    cta1: { label: 'Shop K-Beauty', href: '/shop?category=korean-skincare' },
    cta2: { label: 'View All', href: '/shop' },
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 3,
    badge: 'New Arrivals',
    headline: 'Your Skin Deserves the Best',
    subheadline: 'Shop luxury skincare and makeup from the world\'s most trusted beauty brands.',
    cta1: { label: 'Shop New', href: '/shop?filter=new' },
    cta2: { label: 'Best Sellers', href: '/shop?filter=bestseller' },
    image: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsAnimating(false);
    }, 300);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C2E] via-[#2A2A40] to-[#1C1C2E]">
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${isAnimating ? 'opacity-0' : 'opacity-40'}`}
      >
        <Image
          src={slide.image}
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C2E] via-[#1C1C2E]/80 to-transparent" />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C4818A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#E8A0AA]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-36">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-[#C4818A]/20 border border-[#C4818A]/30 rounded-full mb-8 transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <Sparkles size={14} className="text-[#E8A0AA]" />
            <span className="text-white text-sm font-medium tracking-wide">{slide.badge}</span>
          </div>

          {/* Headline */}
          <h1
            className={`font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span className="block">{slide.headline.split(' ').slice(0, 2).join(' ')}</span>
            <span
              className="block bg-gradient-to-r from-[#E8A0AA] via-[#C4818A] to-[#E8C88A] bg-clip-text text-transparent"
            >
              {slide.headline.split(' ').slice(2).join(' ')}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {slide.subheadline}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <Link
              href={slide.cta1.href}
              className="group flex items-center gap-2.5 bg-[#C4818A] hover:bg-[#B06E77] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#C4818A]/25 hover:-translate-y-0.5"
            >
              {slide.cta1.label}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={slide.cta2.href}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300"
            >
              {slide.cta2.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? 'w-10 h-2.5 bg-[#C4818A]'
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
