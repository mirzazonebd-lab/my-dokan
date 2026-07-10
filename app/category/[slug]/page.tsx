import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { categories } from '@/lib/data/categories';
import { products } from '@/lib/data/products';
import CategoryClient from './CategoryClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find(c => c.slug === params.slug);
  if (!category) return { title: 'Category Not Found – Beauty Dokan BD' };
  return {
    title: `${category.name} – Beauty Dokan BD | Premium Beauty in Bangladesh`,
    description: category.description,
    openGraph: {
      title: `${category.name} – Beauty Dokan BD`,
      description: category.description,
      images: [{ url: category.image }],
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find(c => c.slug === params.slug);
  if (!category) notFound();

  const categoryProducts = products.filter(p =>
    p.category.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryClient category={category} products={categoryProducts} />
        <Footer />
      </div>
    </ClientWrapper>
  );
}
