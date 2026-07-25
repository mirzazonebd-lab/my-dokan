'use client';

import { ShieldCheck, Truck, CreditCard, MapPin, RefreshCcw } from 'lucide-react';
import { SITE_INFO } from '@/lib/config/site-info';

const badges = [
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    description: 'All products sourced from authorized distributors',
  },
  {
    icon: Truck,
    title: 'Pan-Bangladesh Delivery',
    description: `We deliver to all ${SITE_INFO.deliveryInfo.deliveryDistricts} districts`,
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: SITE_INFO.paymentMethodsText,
  },
  {
    icon: MapPin,
    title: 'Fast Shipping',
    description: `Dhaka ${SITE_INFO.deliveryInfo.dhakaDelivery}, Outside ${SITE_INFO.deliveryInfo.outsideDhakaDelivery}`,
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free returns',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-3">
              <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <badge.icon size={20} className="text-[#C4818A]" />
              </div>
              <div>
                <p className="font-semibold text-[#1C1C2E] text-sm">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
