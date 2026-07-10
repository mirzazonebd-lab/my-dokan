import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { brands, getKoreanBrands, getInternationalBrands } from '@/lib/data/brands';
import BrandsClient from './BrandsClient';

export const metadata: Metadata = {
  title: 'Shop by Brand – K-Beauty & International Brands | Beauty Dokan BD',
  description: 'Discover authentic Korean beauty brands and trusted international skincare. Shop COSRX, Laneige, CeraVe, The Ordinary, and more at Beauty Dokan BD.',
  openGraph: {
    title: 'Shop by Brand – Beauty Dokan BD',
    description: 'Discover authentic Korean beauty brands and trusted international skincare at Beauty Dokan BD.',
  },
};

export default function BrandsPage() {
  const koreanBrands = getKoreanBrands();
  const internationalBrands = getInternationalBrands();

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BrandsClient koreanBrands={koreanBrands} internationalBrands={internationalBrands} />
        <Footer />
      </div>
    </ClientWrapper>
  );
}
