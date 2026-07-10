import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data/categories';

export default function FeaturedCategories() {
  const featured = categories.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E]">
              Shop by <span className="text-[#C4818A]">Category</span>
            </h2>
            <p className="text-gray-500 mt-2">Find exactly what you need</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#C4818A] hover:gap-2.5 transition-all mt-4 sm:mt-0"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-rose-50"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C2E]/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                <p className="text-white/60 text-xs mt-0.5">{cat.productCount}+ products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
