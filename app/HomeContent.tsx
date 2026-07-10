'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementTicker from '@/components/sections/AnnouncementTicker';
import HeroBanner from '@/components/sections/HeroBanner';
import TrustBadges from '@/components/sections/TrustBadges';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import BestSellers from '@/components/sections/BestSellers';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import CustomerReviews from '@/components/sections/CustomerReviews';
import Newsletter from '@/components/sections/Newsletter';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BackToTop from '@/components/BackToTop';

export default function HomeContent() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />
        <AnnouncementTicker />
        <main>
          <HeroBanner />
          <TrustBadges />
          <FeaturedCategories />
          <BestSellers />
          <WhyChooseUs />
          <CustomerReviews />
          <Newsletter />
        </main>
        <Footer />
      </div>
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
