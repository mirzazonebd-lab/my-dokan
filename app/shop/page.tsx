import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop All Products – Beauty Dokan BD',
  description:
    'Browse 500+ authentic skincare, makeup, hair care and beauty products from Korean and global brands. Filter by category, brand, price, and more.',
};

export default function ShopPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ShopClient />
        <Footer />
      </div>
    </ClientWrapper>
  );
}
