import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { brands } from '@/lib/data/brands';
import { products } from '@/lib/data/products';
import BrandClient from './BrandClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return brands.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = brands.find(b => b.slug === params.slug);
  if (!brand) return { title: 'Brand Not Found – Beauty Dokan BD' };
  return {
    title: `${brand.name} – ${brand.country} Skincare | Beauty Dokan BD`,
    description: brand.description,
    openGraph: {
      title: `${brand.name} – Beauty Dokan BD`,
      description: brand.description,
      images: [{ url: brand.logo }],
    },
  };
}

export default function BrandPage({ params }: Props) {
  const brand = brands.find(b => b.slug === params.slug);
  if (!brand) notFound();

  const brandProducts = products.filter(p =>
    p.brand.toLowerCase() === brand.name.toLowerCase()
  );

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BrandClient brand={brand} products={brandProducts} />
        <Footer />
      </div>
    </ClientWrapper>
  );
}
