'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartStore';
import Image from 'next/image';
import { Heart, ShoppingBag, Share2, Star, Check, ChevronDown, Truck, RefreshCw, Shield, Package, Smartphone, CreditCard, ArrowRight, Plus, Minus, Copy, Facebook, CircleCheck as CheckCircle2, Info, Clock, MapPin, Eye } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { getReviewsForProduct } from '@/lib/data/reviews';
import ImageGallery from './ImageGallery';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

function useRecentlyViewed(currentId: string) {
  const [viewed, setViewed] = useState<string[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem('rv_products');
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const updated = [currentId, ...ids.filter(id => id !== currentId)].slice(0, 8);
    localStorage.setItem('rv_products', JSON.stringify(updated));
    setViewed(updated.filter(id => id !== currentId));
  }, [currentId]);
  return viewed;
}

const TAB_IDS = ['description', 'ingredients', 'how-to-use', 'reviews'] as const;
type TabId = typeof TAB_IDS[number];

function TabButton({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
        active
          ? 'border-[#C4818A] text-[#C4818A]'
          : 'border-transparent text-gray-500 hover:text-[#1C1C2E] hover:border-gray-200'
      }`}
    >
      {label}
      {badge !== undefined && (
        <span className="px-1.5 py-0.5 bg-rose-50 text-[#C4818A] text-[10px] font-bold rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function ReviewCard({ review }: { review: ReturnType<typeof getReviewsForProduct>[0] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-rose-100">
            <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" sizes="40px" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[#1C1C2E] text-sm">{review.userName}</p>
              {review.verified && (
                <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400">{review.location} · {review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={13} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
          ))}
        </div>
      </div>
      <p className="font-semibold text-[#1C1C2E] text-sm mb-1">{review.title}</p>
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
      <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
        <Eye size={11} />
        {review.helpful} people found this helpful
      </div>
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <Link href={`/product/${product.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-rose-50">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C4818A] text-white text-[10px] font-bold rounded-full">-{product.discountPercent}%</span>
        )}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all ${wishlisted ? 'bg-[#C4818A] text-white' : 'bg-white text-gray-500 hover:bg-[#C4818A] hover:text-white'}`}
        >
          <Heart size={12} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold text-[#C4818A] mb-1">{product.brand}</p>
        <h4 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug mb-2">{product.name}</h4>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={10} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
          ))}
          <span className="text-[10px] text-gray-400">({product.totalReviews})</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-[#1C1C2E]">৳{product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="text-[10px] text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const reviews = getReviewsForProduct(product.id);
  const recentlyViewedIds = useRecentlyViewed(product.id);

  const { products: allProducts } = require('@/lib/data/products');
  const recentlyViewed = recentlyViewedIds
    .map((id: string) => allProducts.find((p: Product) => p.id === id))
    .filter(Boolean)
    .slice(0, 6) as Product[];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (buyRef.current) observer.observe(buyRef.current);
    return () => observer.disconnect();
  }, []);

  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      await addItem(product, qty);
    } catch (err) {
      // ignore failures for now
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await addItem(product, qty);
    } catch (err) {
      // ignore
    }
    router.push('/checkout');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.shortDescription, url: window.location.href }).catch(() => {});
    } else {
      setShareOpen(true);
    }
  };

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const usageSteps = product.usageInstructions.split('.').filter(s => s.trim()).map(s => s.trim());

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#C4818A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C4818A] transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#C4818A] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#1C1C2E] font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-12">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery images={product.gallery} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badge === 'Best Seller' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full border border-amber-200">
                  Best Seller
                </span>
              )}
              {product.badge === 'New' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-[#C4818A] text-xs font-semibold rounded-full border border-rose-200">
                  New Arrival
                </span>
              )}
              {product.badge === 'Sale' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-200">
                  On Sale
                </span>
              )}
              {product.category === 'Korean Skincare' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-200">
                  Authentic K-Beauty
                </span>
              )}
            </div>

            {/* Brand */}
            <p className="text-sm font-semibold text-[#C4818A] uppercase tracking-widest">{product.brand}</p>

            {/* Name */}
            <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-[#1C1C2E] leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
                <span className="font-bold text-[#1C1C2E]">{product.rating}</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-sm text-[#C4818A] underline underline-offset-2 hover:no-underline"
                >
                  {product.totalReviews.toLocaleString()} reviews
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Package size={14} />
                <span className={product.stockStatus === 'in_stock' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                  {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-poppins text-3xl font-bold text-[#1C1C2E]">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="px-2.5 py-1 bg-[#C4818A] text-white text-sm font-bold rounded-xl">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-700 font-medium">
                  You save ৳{savings.toLocaleString()} on this purchase
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes. Free shipping over ৳1500.</p>
            </div>

            {/* Skin Type */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suitable For</p>
              <span className="px-3 py-1 bg-white border border-rose-200 text-sm text-gray-600 rounded-xl">
                {product.skinType}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 leading-relaxed text-sm border-l-2 border-[#C4818A] pl-4">
              {product.shortDescription}
            </p>

            {/* Qty + Add to Cart */}
            <div ref={buyRef} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-rose-50 text-gray-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-[#1C1C2E]">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-rose-50 text-gray-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus !== 'in_stock'}
                  className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : product.stockStatus !== 'in_stock'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1C1C2E] hover:bg-[#2D2D44] text-white hover:-translate-y-0.5 shadow-luxury hover:shadow-luxury-hover'
                  }`}
                >
                  {addedToCart ? <><CheckCircle2 size={16} /> Added to Cart!</> : <><ShoppingBag size={16} /> Add to Cart</>}
                </button>

                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    wishlisted ? 'bg-rose-50 border-[#C4818A] text-[#C4818A]' : 'border-gray-200 text-gray-500 hover:border-[#C4818A] hover:text-[#C4818A]'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-[#C4818A] text-[#C4818A] hover:bg-[#C4818A] hover:text-white font-semibold text-sm transition-all duration-300"
                >
                  Buy Now — ৳{(product.price * qty).toLocaleString()}
                  <ArrowRight size={16} />
                </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Options</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Package, label: 'Cash on Delivery', desc: 'Pay when delivered', color: 'text-green-600 bg-green-50' },
                  { icon: Smartphone, label: 'bKash', desc: '01XXXXXXXXX', color: 'text-pink-600 bg-pink-50' },
                  { icon: CreditCard, label: 'Nagad', desc: '01XXXXXXXXX', color: 'text-orange-600 bg-orange-50' },
                ].map(({ icon: Icon, label, desc, color }) => (
                  <div key={label} className="text-center p-2.5 bg-gray-50 rounded-xl">
                    <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
                      <Icon size={15} />
                    </div>
                    <p className="text-xs font-semibold text-[#1C1C2E] leading-tight">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2">
              {[
                { icon: Truck, text: 'Free delivery on orders over ৳1500', sub: 'Standard delivery: 2–4 business days', color: 'text-blue-500 bg-blue-50' },
                { icon: MapPin, text: 'Delivery to all 64 districts', sub: 'Express delivery available in Dhaka', color: 'text-[#C4818A] bg-rose-50' },
                { icon: Clock, text: 'Order before 3 PM for same-day dispatch', sub: 'Weekdays only', color: 'text-green-500 bg-green-50' },
                { icon: RefreshCw, text: '7-Day Easy Return Policy', sub: 'Hassle-free returns & refunds', color: 'text-purple-500 bg-purple-50' },
                { icon: Shield, text: '100% Authentic Products Guaranteed', sub: 'Direct from authorized distributors', color: 'text-amber-500 bg-amber-50' },
              ].map(({ icon: Icon, text, sub, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1C2E]">{text}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Share:</span>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#C4818A] px-3 py-1.5 border border-gray-200 rounded-lg hover:border-[#C4818A] transition-colors"
                >
                  <Share2 size={13} />
                  Share Product
                </button>
                {shareOpen && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-luxury p-3 min-w-[200px] z-20">
                    <p className="text-xs font-semibold text-gray-400 mb-2">Share via</p>
                    <div className="space-y-1">
                      <button onClick={handleCopyLink} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-rose-50 hover:text-[#C4818A] text-gray-700 transition-colors">
                        {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-700 transition-colors">
                        <Facebook size={14} /> Facebook
                      </a>
                    </div>
                    <button onClick={() => setShareOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto text-xs text-gray-500">
                <Info size={13} />
                <span>SKU: {product.id.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-card mb-8">
          {/* Tab Nav */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 px-4">
            {TAB_IDS.map(id => (
              <TabButton
                key={id}
                label={id === 'how-to-use' ? 'How to Use' : id.charAt(0).toUpperCase() + id.slice(1)}
                active={activeTab === id}
                onClick={() => setActiveTab(id)}
                badge={id === 'reviews' ? reviews.length : undefined}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Description */}
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed text-base mb-4">{product.fullDescription}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Category', value: product.category },
                    { label: 'Skin Type', value: product.skinType },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className="text-sm font-semibold text-[#1C1C2E]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {activeTab === 'ingredients' && (
              <div>
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                  <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Ingredients are listed in descending order of concentration. Always patch test before use.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-700 leading-loose font-mono">
                    {product.ingredients}
                  </p>
                </div>
              </div>
            )}

            {/* How to Use */}
            {activeTab === 'how-to-use' && (
              <div>
                <p className="text-sm text-gray-500 mb-5">Follow these steps for best results:</p>
                <ol className="space-y-4">
                  {usageSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#C4818A] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-3.5">
                        <p className="text-sm text-gray-700">{step}.</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <ReviewCard key={r.id} review={r} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-poppins text-2xl font-bold text-[#1C1C2E]">
                You Might Also <span className="text-[#C4818A]">Like</span>
              </h2>
              <Link href="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-[#C4818A] hover:gap-2.5 transition-all">
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.slice(0, 6).map(p => (
                <RelatedProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-poppins text-2xl font-bold text-[#1C1C2E]">
                Recently <span className="text-[#C4818A]">Viewed</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentlyViewed.map(p => (
                <RelatedProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Buy Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ${
          stickyVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="44px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1C1C2E] truncate">{product.name}</p>
              <p className="text-xs text-gray-400">{product.brand}</p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <p className="text-lg font-bold text-[#1C1C2E]">৳{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                addedToCart ? 'bg-green-500 text-white' : 'bg-[#1C1C2E] text-white hover:bg-[#2D2D44]'
              }`}
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">{addedToCart ? 'Added!' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#C4818A] text-white hover:bg-[#B06E77] transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={() => setWishlisted(w => !w)}
              className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                wishlisted ? 'bg-rose-50 border-[#C4818A] text-[#C4818A]' : 'border-gray-200 text-gray-400 hover:border-[#C4818A] hover:text-[#C4818A]'
              }`}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
