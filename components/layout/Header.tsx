'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Truck,
  Star,
} from 'lucide-react';
import { useCart } from '@/components/cart/CartStore';
import LiveSearch from '@/components/LiveSearch';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Shop',
    href: '/shop',
    mega: true,
    columns: [
      {
        title: 'Skincare',
        links: [
          { label: 'All Skincare', href: '/category/skincare' },
          { label: 'Korean Skincare', href: '/category/korean-skincare' },
          { label: 'Sunscreen', href: '/category/sunscreen' },
          { label: 'Serums & Essence', href: '/shop?category=serums' },
          { label: 'Moisturizers', href: '/shop?category=moisturizers' },
          { label: 'Eye Cream', href: '/shop?category=eye-cream' },
          { label: 'Cleansers', href: '/shop?category=cleansers' },
          { label: 'Masks', href: '/shop?category=masks' },
        ],
      },
      {
        title: 'Makeup',
        links: [
          { label: 'All Makeup', href: '/category/makeup' },
          { label: 'Foundation', href: '/shop?category=foundation' },
          { label: 'Lipstick & Tint', href: '/shop?category=lipstick' },
          { label: 'Mascara', href: '/shop?category=mascara' },
          { label: 'Eyeshadow', href: '/shop?category=eyeshadow' },
          { label: 'Blush & Contour', href: '/shop?category=blush' },
          { label: 'Brow Products', href: '/shop?category=brow' },
          { label: 'Setting Spray', href: '/shop?category=setting' },
        ],
      },
      {
        title: 'Hair & Body',
        links: [
          { label: 'Hair Care', href: '/category/hair-care' },
          { label: 'Body Care', href: '/category/body-care' },
          { label: 'Shampoo', href: '/shop?category=shampoo' },
          { label: 'Conditioner', href: '/shop?category=conditioner' },
          { label: 'Body Lotion', href: '/shop?category=lotion' },
          { label: 'Body Wash', href: '/shop?category=wash' },
          { label: 'Fragrance', href: '/category/fragrance' },
          { label: 'Mens Grooming', href: '/category/mens-grooming' },
        ],
      },
      {
        title: 'Featured',
        featured: true,
        links: [
          { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
          { label: 'Flash Sale', href: '/shop?filter=sale' },
          { label: 'New Arrivals', href: '/shop?filter=new' },
          { label: 'K-Beauty', href: '/category/korean-skincare' },
          { label: 'All Brands', href: '/brands' },
          { label: "Men's Grooming", href: '/category/mens-grooming' },
        ],
      },
    ],
  },
  { label: 'Brands', href: '/brands' },
  { label: 'Korean Skincare', href: '/category/korean-skincare' },
  { label: 'Makeup', href: '/category/makeup' },
  { label: 'Hair Care', href: '/category/hair-care' },
  { label: 'Body Care', href: '/category/body-care' },
  { label: "Men's Grooming", href: '/category/mens-grooming' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const wishlistCount = 0; // Will be connected to wishlist store

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1C1C2E] text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck size={12} className="text-pink-400" />
              Free delivery on orders over ৳1500
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-pink-400" />
              Delivering to all 64 districts
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              4.8/5 from 10,000+ customers
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-pink-400" />
              +8809638758429
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-luxury border-b border-rose-100'
            : 'bg-white border-b border-rose-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative w-12 h-12 md:w-14 md:h-14">
                <Image
                  src="/logo65 copy.png"
                  alt="Beauty Dokan BD"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-poppins font-700 text-base md:text-lg text-[#1C1C2E] leading-tight tracking-tight">
                  Beauty Dokan <span className="text-[#C4818A]">BD</span>
                </p>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">Premium Beauty</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav ref={megaRef} className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.mega ? setMegaOpen(item.label) : setMegaOpen(null)}
                  onMouseLeave={() => setMegaOpen(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      megaOpen === item.label
                        ? 'text-[#C4818A] bg-rose-50'
                        : 'text-gray-700 hover:text-[#C4818A] hover:bg-rose-50'
                    }`}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${megaOpen === item.label ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {item.mega && megaOpen === item.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[780px] bg-white rounded-2xl shadow-luxury-hover border border-rose-100 p-6 grid grid-cols-4 gap-6 animate-fade-in"
                      style={{ zIndex: 100 }}
                    >
                      {item.columns?.map((col) => (
                        <div key={col.title}>
                          <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
                            col.featured ? 'text-[#C4818A]' : 'text-gray-400'
                          }`}>
                            {col.title}
                          </h3>
                          <ul className="space-y-1.5">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="text-sm text-gray-600 hover:text-[#C4818A] transition-colors block py-0.5"
                                  onClick={() => setMegaOpen(null)}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-[#C4818A] hover:bg-rose-50 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 rounded-lg text-gray-600 hover:text-[#C4818A] hover:bg-rose-50 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C4818A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 rounded-lg text-gray-600 hover:text-[#C4818A] hover:bg-rose-50 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-2 bg-[#C4818A] hover:bg-[#B06E77] text-white px-3 py-2 rounded-xl transition-colors relative ml-1"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="text-xs font-semibold hidden sm:inline">
                    {cartTotal.toLocaleString()} BDT
                  </span>
                )}
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1C1C2E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-[#C4818A] hover:bg-rose-50 transition-colors lg:hidden ml-1"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Live Search Overlay */}
      <LiveSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-rose-100">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image src="/logo65 copy.png" alt="Beauty Dokan BD" fill className="object-contain" />
                </div>
                <span className="font-poppins font-semibold text-[#1C1C2E]">
                  Beauty Dokan <span className="text-[#C4818A]">BD</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-rose-50 text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="p-4 space-y-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop All', href: '/shop' },
                { label: 'Korean Skincare', href: '/korean-skincare' },
                { label: 'Makeup', href: '/makeup' },
                { label: 'Skincare', href: '/skincare' },
                { label: 'Hair Care', href: '/hair-care' },
                { label: 'Body Care', href: '/body-care' },
                { label: "Men's Grooming", href: '/mens-grooming' },
                { label: 'Brands', href: '/brands' },
                { label: 'Flash Sale ⚡', href: '/flash-sale' },
                { label: 'New Arrivals ✨', href: '/new-arrivals' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:text-[#C4818A] hover:bg-rose-50 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Footer Info */}
            <div className="p-4 border-t border-rose-100 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} className="text-[#C4818A]" />
                <span>Free delivery over ৳2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-[#C4818A]" />
                <span>+8809638758429</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-[#C4818A]" />
                <span>All 64 districts of Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
