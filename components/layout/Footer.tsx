import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

const shopLinks = [
  { label: 'All Products', href: '/shop' },
  { label: 'Korean Skincare', href: '/shop?category=korean-skincare' },
  { label: 'Makeup', href: '/shop?category=makeup' },
  { label: 'Hair Care', href: '/shop?category=hair-care' },
];

const brandLinks = [
  { label: 'COSRX', href: '/brand/cosrx' },
  { label: 'Laneige', href: '/brand/laneige' },
  { label: 'Some By Mi', href: '/brand/some-by-mi' },
  { label: 'Innisfree', href: '/brand/innisfree' },
];

const helpLinks = [
  { label: 'Track Order', href: '/account/orders' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1C1C2E] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden p-1">
                <Image src="/logo65 copy.png" alt="Beauty Dokan BD" fill className="object-contain" />
              </div>
              <span className="font-poppins font-bold text-lg text-white">
                Beauty Dokan <span className="text-[#E8A0AA]">BD</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Bangladesh&apos;s trusted destination for authentic Korean skincare and global beauty brands.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-[#E8A0AA]" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-[#E8A0AA]" />
                <span>01712-012737</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-[#E8A0AA]" />
                <span>beautydokanbd.online@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-5">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#E8A0AA] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-5">Top Brands</h3>
            <ul className="space-y-3">
              {brandLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#E8A0AA] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-5">Help</h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#E8A0AA] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-white/10 hover:bg-[#C4818A] rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Beauty Dokan BD. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-[#E8A0AA] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#E8A0AA] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
