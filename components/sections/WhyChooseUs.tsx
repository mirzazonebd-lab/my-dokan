import { Shield, Truck, RefreshCw, Headphones, CreditCard, MapPin } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '100% Authentic',
    description: 'Direct from authorized distributors',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On orders over ৳1500',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7-day hassle-free returns',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Beauty experts available 7 days',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'bKash, Nagad, Card, COD',
  },
  {
    icon: MapPin,
    title: 'All 64 Districts',
    description: 'Nationwide coverage',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#1C1C2E] mb-4">
            Why Shop With <span className="text-[#C4818A]">Beauty Dokan BD</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Bangladesh&apos;s most trusted premium beauty destination since 2020
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center p-6"
            >
              <div className="w-14 h-14 mx-auto bg-[#C4818A]/10 rounded-2xl flex items-center justify-center mb-4">
                <f.icon size={24} className="text-[#C4818A]" />
              </div>
              <h3 className="font-semibold text-[#1C1C2E] mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '500+', label: 'Products' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '4.8', label: 'Average Rating' },
            { value: '64', label: 'Districts' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <p className="font-poppins text-2xl font-bold text-[#C4818A]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
