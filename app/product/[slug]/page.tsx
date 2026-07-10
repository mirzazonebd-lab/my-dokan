import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { products } from '@/lib/data/products';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return { title: 'Product Not Found – Beauty Dokan BD' };
  return {
    title: `${product.name} – ${product.brand} | Beauty Dokan BD`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} – ${product.brand}`,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ProductDetailClient product={product} relatedProducts={related} />
        <Footer />
      </div>
    </ClientWrapper>
  );
}
