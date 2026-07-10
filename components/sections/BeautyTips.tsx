import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

const tips = [
  {
    id: 1,
    category: 'Skincare Routine',
    title: 'The 10-Step Korean Skincare Routine Explained',
    excerpt:
      'Unlock the secrets of the world-famous K-beauty routine — from double cleansing to sleeping masks — and achieve that coveted glass skin glow.',
    image: 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: '5 min read',
    href: '/blog/korean-skincare-routine',
    featured: true,
  },
  {
    id: 2,
    category: 'Ingredient Guide',
    title: 'Niacinamide vs Vitamin C: Which Should You Choose?',
    excerpt:
      'Two of the most powerful brightening ingredients — but which is right for your skin type? We break it down simply.',
    image: 'https://images.pexels.com/photos/3785148/pexels-photo-3785148.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: '4 min read',
    href: '/blog/niacinamide-vs-vitamin-c',
    featured: false,
  },
  {
    id: 3,
    category: 'SPF Guide',
    title: 'Why Sunscreen Is the Most Important Skincare Step',
    excerpt:
      'In Bangladesh\'s sunny climate, SPF is non-negotiable. Here\'s how to choose and apply sunscreen the right way.',
    image: 'https://images.pexels.com/photos/5069291/pexels-photo-5069291.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: '3 min read',
    href: '/blog/sunscreen-guide',
    featured: false,
  },
  {
    id: 4,
    category: "Men's Skincare",
    title: "The Beginner's Skincare Routine for Men",
    excerpt:
      'Simple, effective and takes just 5 minutes a day. Here\'s how men in Bangladesh can start taking care of their skin.',
    image: 'https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=600',
    readTime: '4 min read',
    href: '/blog/mens-skincare-beginners',
    featured: false,
  },
];

export default function BeautyTips() {
  const featured = tips.find((t) => t.featured)!;
  const others = tips.filter((t) => !t.featured);

  return (
    <section className="py-16 md:py-24 bg-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-[#C4818A] uppercase tracking-widest mb-2">
              Beauty Knowledge
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E]">
              Beauty Tips & <span className="text-[#C4818A]">Guides</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#C4818A] hover:gap-2.5 transition-all mt-4 sm:mt-0"
          >
            Read All Articles
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          <Link
            href={featured.href}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C2E]/90 via-[#1C1C2E]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-[#C4818A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                {featured.category}
              </span>
              <h3 className="font-poppins text-xl md:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-[#E8A0AA] transition-colors">
                {featured.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-white/60 text-xs">
                  <Clock size={12} />
                  {featured.readTime}
                </div>
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold group-hover:gap-2 transition-all">
                  Read Article <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </Link>

          {/* Other Articles */}
          <div className="grid grid-cols-1 gap-4">
            {others.map((tip) => (
              <Link
                key={tip.id}
                href={tip.href}
                className="group flex items-center gap-4 bg-white border border-rose-100 hover:border-[#C4818A] rounded-2xl p-4 transition-all duration-300 hover:shadow-card"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={tip.image}
                    alt={tip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-[#C4818A] text-[10px] font-bold uppercase tracking-wider rounded-full mb-1.5">
                    {tip.category}
                  </span>
                  <h3 className="font-semibold text-sm text-[#1C1C2E] leading-snug mb-1.5 group-hover:text-[#C4818A] transition-colors line-clamp-2">
                    {tip.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Clock size={11} />
                    {tip.readTime}
                    <span className="mx-1">·</span>
                    <BookOpen size={11} />
                    Beauty Tips
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 group-hover:text-[#C4818A] group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
