import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getFeaturedBrands } from '@/lib/data/brands';

const brandColors: Record<string, string> = {
  COSRX: 'from-sky-50 to-blue-50',
  Laneige: 'from-rose-50 to-pink-50',
  Innisfree: 'from-green-50 to-emerald-50',
  'Some By Mi': 'from-purple-50 to-violet-50',
  Sulwhasoo: 'from-amber-50 to-yellow-50',
  Neutrogena: 'from-blue-50 to-cyan-50',
  Maybelline: 'from-rose-50 to-red-50',
  "L'Oreal Paris": 'from-yellow-50 to-amber-50',
  Klairs: 'from-pink-50 to-rose-50',
  'The Ordinary': 'from-gray-50 to-slate-50',
};

export default function FeaturedBrands() {
  const brands = getFeaturedBrands();

  return (
    <section className="py-16 md:py-24 bg-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-[#C4818A] uppercase tracking-widest mb-2">
              Our Partners
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E]">
              Premium <span className="text-[#C4818A]">Brands</span> We Carry
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              All products are 100% authentic, sourced directly from authorized distributors.
            </p>
          </div>
          <Link
            href="/brands"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#C4818A] hover:gap-2.5 transition-all mt-4 sm:mt-0"
          >
            View All Brands
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.slice(0, 10).map((brand, i) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className={`group relative bg-gradient-to-br ${brandColors[brand.name] || 'from-gray-50 to-slate-50'} border border-gray-100 hover:border-[#C4818A] rounded-2xl p-5 transition-all duration-300 hover:shadow-rose hover:-translate-y-1`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Brand Logo */}
              <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-xl">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Brand Info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-[#1C1C2E] group-hover:text-[#C4818A] transition-colors">
                    {brand.name}
                  </h3>
                  <ExternalLink
                    size={12}
                    className="text-gray-300 group-hover:text-[#C4818A] transition-colors"
                  />
                </div>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  {brand.isKorean ? '🇰🇷' : '🌍'} {brand.country}
                </p>
              </div>

              {/* Korean Badge */}
              {brand.isKorean && (
                <div className="absolute top-3 right-3">
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-bold rounded uppercase">
                    K-Beauty
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Korean Brand Spotlight */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1C1C2E] via-[#2D1B2E] to-[#1C1C2E] p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="K-Beauty"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-block text-xs font-semibold text-[#E8A0AA] uppercase tracking-widest mb-3">
                🇰🇷 Korean Beauty Specialist
              </span>
              <h3 className="font-poppins text-2xl md:text-3xl font-bold text-white mb-3">
                Authentic K-Beauty, Right Here in Bangladesh
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                We source directly from Korea so you get the real deal — authentic products
                at fair prices, delivered anywhere in Bangladesh.
              </p>
            </div>
            <Link
              href="/korean-skincare"
              className="flex-shrink-0 flex items-center gap-2 bg-[#C4818A] hover:bg-[#B06E77] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Shop K-Beauty
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
