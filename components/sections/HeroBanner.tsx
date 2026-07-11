'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'Your Trusted Destination',
    headline: 'Premium Beauty Products',
    subheadline: 'Discover authentic global skincare, makeup, hair care, body care and men\'s grooming products—all in one place.',
    cta1: { label: 'Shop Now', href: '/shop' },
    cta2: { label: 'Explore Brands', href: '/brands' },
    // Luxury flat-lay: soft pink background, glass serums, cream jars, flowers, gold accents
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#E8A0AA',
  },
  {
    id: 2,
    badge: 'K-Beauty Essentials',
    headline: 'Korean Skincare Revolution',
    subheadline: 'Experience the world-renowned 10-step Korean skincare routine with authentic products sourced directly from Korea.',
    cta1: { label: 'Shop K-Beauty', href: '/shop?category=korean-skincare' },
    cta2: { label: 'View All', href: '/shop' },
    // Elegant Korean skincare bottles, serums, pastel tones
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#C4818A',
  },
  {
    id: 3,
    badge: 'New Arrivals',
    headline: 'Your Skin Deserves the Best',
    subheadline: 'Shop luxury skincare and makeup from the world\'s most trusted beauty brands. Delivered to your door across Bangladesh.',
    cta1: { label: 'Shop New', href: '/shop?filter=new' },
    cta2: { label: 'Best Sellers', href: '/shop?filter=bestseller' },
    // Premium cosmetics flat-lay, marble, pastel pink and white
    image: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    accent: '#E8C88A',
  },
];

const TRUST_PILLS = [
  { icon: '✓', text: '100% Authentic' },
  { icon: '🚚', text: 'Free Delivery ৳1500+' },
  { icon: '⭐', text: '10,000+ Happy Customers' },
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
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsAnimating(false);
    }, 400);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#1a0a0e]" style={{ minHeight: 'clamp(480px, 70vh, 700px)' }}>
      {/* Background Image with crossfade */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={slide.image}
          alt="Beauty lifestyle"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Layered gradient: left heavy for text readability, warm tint on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0e]/95 via-[#1a0a0e]/70 to-[#1a0a0e]/20" />
        {/* Top + bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0e]/30 via-transparent to-[#1a0a0e]/50" />
      </div>

      {/* Decorative glow orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C4818A]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-[#E8A0AA]/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 'clamp(480px, 70vh, 700px)' }}>
        <div className="py-16 md:py-24 w-full max-w-2xl">
          {/* Trust badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-[#C4818A]/20 border border-[#C4818A]/40 rounded-full mb-6 backdrop-blur-sm transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            <Sparkles size={13} className="text-[#E8A0AA]" />
            <span className="text-white/90 text-sm font-medium tracking-wide">{slide.badge}</span>
          </div>

          {/* Headline */}
          <h1
            className={`font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '80ms' }}
          >
            {(() => {
              const words = slide.headline.split(' ');
              const first = words.slice(0, 2).join(' ');
              const rest = words.slice(2).join(' ');
              return (
                <>
                  <span className="block">{first}</span>
                  {rest && (
                    <span className="block bg-gradient-to-r from-[#FFBDCA] via-[#E8A0AA] to-[#E8C88A] bg-clip-text text-transparent">
                      {rest}
                    </span>
                  )}
                </>
              );
            })()}
          </h1>

          {/* Subheadline */}
          <p
            className={`text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-md transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '160ms' }}
          >
            {slide.subheadline}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap items-center gap-3 mb-10 transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '240ms' }}
          >
            <Link
              href={slide.cta1.href}
              className="group inline-flex items-center gap-2.5 bg-[#C4818A] hover:bg-[#B06E77] text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-2xl hover:shadow-[#C4818A]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {slide.cta1.label}
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href={slide.cta2.href}
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/18 backdrop-blur-sm border border-white/25 hover:border-white/40 text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300"
            >
              {slide.cta2.label}
            </Link>
          </div>

          {/* Trust pills */}
          <div
            className={`flex flex-wrap gap-3 transition-all duration-500 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ transitionDelay: '320ms' }}
          >
            {TRUST_PILLS.map(pill => (
              <div
                key={pill.text}
                className="flex items-center gap-1.5 bg-white/8 backdrop-blur-sm border border-white/12 px-3 py-1.5 rounded-full"
              >
                <span className="text-xs">{pill.icon}</span>
                <span className="text-white/75 text-xs font-medium">{pill.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? 'w-9 h-2 bg-[#C4818A]'
                : 'w-2 h-2 bg-white/30 hover:bg-white/55'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-1.5">
        <Star size={10} className="text-[#C4818A] fill-[#C4818A]" />
        <span className="text-white/40 text-xs font-mono">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="text-white/20 text-xs">/</span>
        <span className="text-white/25 text-xs font-mono">{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
