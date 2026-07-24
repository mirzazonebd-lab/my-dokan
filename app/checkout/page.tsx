'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/data/types';
import { useCart } from '@/components/cart/CartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, Loader as Loader2, User, Phone, Mail, MapPin, Truck, CreditCard, ShoppingBag, Tag, Sparkles, Package, Landmark, Upload } from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDERS_KEY = 'beautydokanbd_orders';
const SETTINGS_KEY = 'beautydokanbd_admin_settings';



// Default settings
const DEFAULT_SETTINGS = {
  storeName: 'Beauty Dokan BD',
  storeEmail: 'info@beautydokan.com',
  storePhone: '+8801712012737',
  freeShippingThreshold: 1500,
  deliveryCharge: 60,
  codEnabled: true,
  bkashEnabled: true,
  nagadEnabled: true,
  emailNotifications: true,
  orderConfirmationSMS: true,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'cart' | 'info' | 'shipping' | 'payment' | 'review';
type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'bank';

interface CustomerInfo {
  fullName: string;
  mobile: string;
  email: string;
}

interface ShippingInfo {
  address: string;
  district: string;
  thana: string;
}

interface PaymentInfo {
  transactionId: string;
  screenshot: string | null;
  screenshotName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STEPS: Step[] = ['cart', 'info', 'shipping', 'payment', 'review'];
const STEP_LABELS: Record<Step, string> = {
  cart: 'Cart', info: 'Information', shipping: 'Shipping', payment: 'Payment', review: 'Review',
};

function calcShipping(district: string, settings: any): number {
  return district === 'Dhaka' ? settings.deliveryCharge : settings.deliveryCharge * 2;
}

function genOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BD${ts}${rand}`;
}

function isDhaka(district: string) {
  return district === 'Dhaka';
}

// ─── Step progress bar ────────────────────────────────────────────────────────

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' :
                  active ? 'bg-[#C4818A] text-white ring-4 ring-[#C4818A]/20' :
                    'bg-gray-200 text-gray-400'
                }`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-[#C4818A]' : done ? 'text-green-600' : 'text-gray-400'
                }`}>{STEP_LABELS[s]}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 sm:w-12 mb-5 transition-all ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">{icon}</div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        {!required && <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── Payment radio ────────────────────────────────────────────────────────────

function PaymentOption({ value, selected, onSelect, icon, iconBg, label, description }: {
  value: PaymentMethod; selected: PaymentMethod; onSelect: (v: PaymentMethod) => void;
  icon: React.ReactNode; iconBg: string; label: string; description: string;
}) {
  const active = selected === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${active ? 'border-[#C4818A] bg-rose-50' : 'border-gray-200 hover:border-rose-200 bg-white'
        }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#C4818A] bg-[#C4818A]' : 'border-gray-300'
        }`}>
        {active && <Check size={11} className="text-white" />}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ─── Order Summary sidebar ────────────────────────────────────────────────────

function OrderSummary({
  items, subtotal, shippingCost, discount, couponCode,
  couponApplied, couponError, onCouponChange, onApplyCoupon,
  showCoupon, payment, coupons, freeShippingThreshold,
}: {
  items: any[]; subtotal: number; shippingCost: number; discount: number;
  couponCode: string; couponApplied: boolean; couponError: string;
  onCouponChange: (v: string) => void; onApplyCoupon: () => void;
  showCoupon: boolean; payment: PaymentMethod; coupons: any[]; freeShippingThreshold: number;
}) {
  const grandTotal = subtotal + shippingCost - discount;
  const paymentLabel = payment === 'cod' ? 'Cash on Delivery' : payment === 'bkash' ? 'bKash' : payment === 'nagad' ? 'Nagad' : payment === 'rocket' ? 'Rocket' : 'Bank Transfer';
  const isFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
      <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map(item => (
          <div key={item.product_id} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-rose-50 flex-shrink-0">
              <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C4818A] text-white text-xs rounded-full flex items-center justify-center font-medium">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{item.product.name}</p>
              <p className="text-xs text-gray-400">{item.product.brand}</p>
            </div>
            <p className="text-sm font-medium flex-shrink-0">
              ৳{(item.product.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {showCoupon && (
        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={couponCode}
                onChange={e => onCouponChange(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="pl-8 text-sm"
              />
            </div>
            <Button onClick={onApplyCoupon} variant="outline" className="px-3 text-sm">Apply</Button>
          </div>
          {couponApplied && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
              <Check size={12} /> Coupon applied — saving ৳{discount}
            </p>
          )}
          {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
        </div>
      )}

      <div className="border-t border-gray-100 pt-4 space-y-2.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-৳{discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className={isFreeShipping ? 'text-green-600 font-medium' : ''}>
            {isFreeShipping ? 'FREE' : `৳${shippingCost}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2.5 border-t border-gray-100">
          <span>Grand Total</span>
          <span className="text-[#C4818A]">৳{grandTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Payment Method</span><span>{paymentLabel}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-gray-900">
          <span>Remaining Due</span><span>{payment === 'cod' ? `৳${grandTotal.toLocaleString()}` : '৳0'}</span>
        </div>
      </div>

      {shippingCost > 0 && !isFreeShipping && (
        <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2">
          <Sparkles size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Free shipping on orders above ৳{freeShippingThreshold.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function CheckoutContent() {
  const router = useRouter();
  const { items, subtotal, clearCart, addItem, loading: cartLoading } = useCart();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>('cart');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false);
  const [urlHydrationInProgress, setUrlHydrationInProgress] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Customer info
  const [info, setInfo] = useState<CustomerInfo>({ fullName: '', mobile: '', email: '' });
  const [infoErrors, setInfoErrors] = useState<Partial<CustomerInfo>>({});

  // Shipping
  const [ship, setShip] = useState<ShippingInfo>({ address: '', district: 'Dhaka', thana: '' });
  const [shipErrors, setShipErrors] = useState<Partial<ShippingInfo>>({});

  // Payment
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({ transactionId: '', screenshot: null, screenshotName: '' });
  const [note, setNote] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);

  // Load settings on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch {
        // Use defaults
      }
    }

    // Load all coupons from admin
    const storedCoupons = localStorage.getItem('beautydokanbd_admin_coupons');
    if (storedCoupons) {
      try {
        setCoupons(JSON.parse(storedCoupons));
      } catch {
        // No coupons
      }
    }
  }, []);

  useEffect(() => { setMounted(true); }, []);

  const tryHydrateFromUrl = useCallback(async () => {
    try {
      if (!mounted) return;
      if (hasHydratedFromUrl) return;
      if (items.length > 0) return;
      const productId = searchParams.get('product');
      const qtyParam = searchParams.get('qty');
      if (!productId || !qtyParam) return;
      const qty = parseInt(qtyParam, 10);
      if (Number.isNaN(qty) || qty < 1) return;

      const { products } = await import('@/lib/data/products');
      const prod = (products as Product[]).find(p => p.id === productId || p.slug === productId);
      if (!prod) return;

      setHasHydratedFromUrl(true);
      setStep('info');
      router.replace('/checkout');
    } catch (err) {
      // ignore fallback failures
    }
  }, [mounted, hasHydratedFromUrl, items.length, searchParams, router]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setUrlHydrationInProgress(true);
      try {
        await tryHydrateFromUrl();
      } finally {
        if (!cancelled) setUrlHydrationInProgress(false);
      }
    };

    if (mounted) run();
    else setUrlHydrationInProgress(false);

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, tryHydrateFromUrl]);

  useEffect(() => {
    if (mounted && !cartLoading && !urlHydrationInProgress && items.length === 0 && step !== 'review') router.push('/shop');
  }, [mounted, cartLoading, urlHydrationInProgress, items.length, step, router]);

  const shippingCost = ship.district ? (subtotal >= settings.freeShippingThreshold ? 0 : calcShipping(ship.district, settings)) : settings.deliveryCharge;
  const grandTotal   = subtotal + shippingCost - discount;
  const thanas       = getThanas(ship.district);

  // ── Coupon ──
  const applyCoupon = useCallback(() => {
    const coupon = coupons.find(c => c.code === couponCode);
    if (coupon && coupon.status === 'active') {
      const discountAmount = coupon.discountType === 'percentage'
        ? Math.round(subtotal * (coupon.discount / 100))
        : coupon.discount;
      setCouponApplied(true);
      setDiscount(discountAmount);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setDiscount(0);
      setCouponError('Invalid or expired coupon code');
    }
  }, [couponCode, coupons, subtotal]);

  const handleCouponChange = (v: string) => {
    setCouponCode(v);
    setCouponApplied(false);
    setDiscount(0);
    setCouponError('');
  };

  // ── Validation ──
  const validateInfo = (): boolean => {
    const e: Partial<CustomerInfo> = {};
    if (!info.fullName.trim()) e.fullName = 'Full name is required';
    if (!info.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^01\d{9}$/.test(info.mobile))
      e.mobile = 'Enter an 11-digit Bangladesh number (01XXXXXXXXX)';
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))
      e.email = 'Enter a valid email address';
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateShipping = (): boolean => {
    const e: Partial<ShippingInfo> = {};
    if (!ship.address.trim()) e.address = 'Delivery address is required';
    if (!ship.district) e.district = 'Please select a district';
    if (!ship.thana) e.thana = 'Please Write a Thana / Upazila';
    setShipErrors(e);
    return Object.keys(e).length === 0;
  };

  const requiresAdvanceProof = payment !== 'cod';
  const validatePayment = (): boolean => {
    if (!requiresAdvanceProof) return true;
    if (!paymentInfo.transactionId.trim()) {
      toast.error('Transaction ID is required for advance payment.');
      return false;
    }
    return true;
  };

  const handleScreenshot = (file?: File) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) { toast.error('Upload a JPG, JPEG, PNG, or PDF file.'); return; }
    if (file.size > 4 * 1024 * 1024) { toast.error('Screenshot must be 4 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => setPaymentInfo(p => ({ ...p, screenshot: String(reader.result), screenshotName: file.name }));
    reader.readAsDataURL(file);
  };

  // ── Navigation ──
  const goNext = () => {
    if (step === 'cart') { setStep('info'); window.scrollTo(0, 0); }
    if (step === 'info') { if (validateInfo()) { setStep('shipping'); window.scrollTo(0, 0); } }
    if (step === 'shipping') { if (validateShipping()) { setStep('payment'); window.scrollTo(0, 0); } }
    if (step === 'payment') { if (validatePayment()) { setStep('review'); window.scrollTo(0, 0); } }
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) { setStep(STEPS[idx - 1]); window.scrollTo(0, 0); }
  };

  // ── Place order ──
  const placeOrder = async () => {
    if (!validateInfo() || !validateShipping() || !validatePayment()) return;
    setLoading(true);
    try {
      const orderNumber = genOrderNumber();
      const order = {
        id: `order-${Date.now()}`,
        order_number: orderNumber,
        status: 'pending',
        subtotal,
        discount,
        shipping: shippingCost,
        total: grandTotal,
        coupon_code: couponApplied ? couponCode : null,
        payment_method: payment,
        transaction_id: paymentInfo.transactionId || null,
        payment_screenshot: paymentInfo.screenshot,
        payment_status: 'Pending Verification',
        shipping_address: {
          name: info.fullName,
          phone: info.mobile,
          email: info.email || null,
          address: ship.address,
          city: ship.thana || null,
          district: ship.district,
          thana: ship.thana,
          postal_code: null,
          zone: isDhaka(ship.district) ? 'dhaka' : 'outside_dhaka',
        },
        items: items.map(item => ({
          id: `item-${Date.now()}-${item.product_id}`,
          product_id: item.product_id,
          product_name: item.product.name,
          product_image: item.product.image,
          brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        })),
        notes: note || null,
        estimated_delivery: isDhaka(ship.district)
          ? '2–3 business days'
          : '4–7 business days',
        created_at: new Date().toISOString(),
      };

      const existing = localStorage.getItem(ORDERS_KEY);
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      localStorage.setItem('beautydokanbd_admin_orders', JSON.stringify(orders));

      await clearCart();
      toast.success('Order placed successfully.');
      router.push(`/checkout/success?order=${orderNumber}`);
    } catch (err) {
      console.error(err);
      toast.error('Unable to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white border border-gray-100 p-10 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-3">Restoring your cart…</p>
            <p className="text-gray-500">Please wait while we restore your saved items.</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (items.length === 0 && step !== 'review') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-gray-700">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <StepBar current={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left / main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── STEP: CART ── */}
            {step === 'cart' && (
              <Card icon={<ShoppingBag size={16} className="text-[#C4818A]" />} title="Your Cart">
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product_id} className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#C4818A] font-medium">{item.product.brand}</p>
                        <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900 flex-shrink-0">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <Link href="/shop" className="text-sm text-[#C4818A] hover:underline">
                    ← Continue Shopping
                  </Link>
                  <Button
                    onClick={goNext}
                    className="bg-[#C4818A] hover:bg-[#B06E77] text-white rounded-xl px-8"
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </Card>
            )}

            {/* ── STEP: CUSTOMER INFO ── */}
            {step === 'info' && (
              <Card icon={<User size={16} className="text-[#C4818A]" />} title="Customer Information">
                <div className="space-y-4">
                  <Field label="Full Name" required error={infoErrors.fullName}>
                    <Input
                      value={info.fullName}
                      onChange={e => setInfo(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g. Rahim Ahmed"
                      className={infoErrors.fullName ? 'border-red-400' : ''}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Mobile Number" required error={infoErrors.mobile}>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          value={info.mobile}
                          onChange={e => setInfo(p => ({ ...p, mobile: e.target.value }))}
                          placeholder="01700-000000"
                          className={`pl-9 ${infoErrors.mobile ? 'border-red-400' : ''}`}
                        />
                      </div>
                    </Field>

                    <Field label="Email" error={infoErrors.email}>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="email"
                          value={info.email}
                          onChange={e => setInfo(p => ({ ...p, email: e.target.value }))}
                          placeholder="email@example.com"
                          className={`pl-9 ${infoErrors.email ? 'border-red-400' : ''}`}
                        />
                      </div>
                    </Field>
                  </div>
                </div>
                <NavButtons onBack={goBack} onNext={goNext} isFirst />
              </Card>
            )}

            {/* ── STEP: SHIPPING ── */}
            {step === 'shipping' && (
              <Card icon={<MapPin size={16} className="text-[#C4818A]" />} title="Shipping Information">
                {/* Zone indicator */}
                <div className="flex gap-3 mb-5">
                  <ZoneChip
                    label="Inside Dhaka"
                    sub={`৳${settings.deliveryCharge} delivery`}
                    active={isDhaka(ship.district)}
                    color="blue"
                  />
                  <ZoneChip
                    label="Outside Dhaka"
                    sub={`৳${settings.deliveryCharge * 2} delivery`}
                    active={!isDhaka(ship.district)}
                    color="orange"
                  />
                </div>

                <div className="space-y-4">
                  <Field label="Full Delivery Address" required error={shipErrors.address}>
                    <Input
                      value={ship.address}
                      onChange={e => setShip(p => ({ ...p, address: e.target.value }))}
                      placeholder="House/Flat no., Road no., Area"
                      className={shipErrors.address ? 'border-red-400' : ''}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="District" required>
                      <Input
                        value={ship.district}
                        list="district-options"
                        placeholder="Search district"
                        onChange={e => setShip(p => ({ ...p, district: e.target.value, thana: '' }))}
                      />
                      <datalist id="district-options">{BANGLADESH_DISTRICTS.map(d => <option key={d} value={d} />)}</datalist>
                    </Field>

                      <Field label="Thana / Upazila" required error={shipErrors.thana}>
                        <Input
                          value={ship.thana}
                          list="thana-options"
                          onChange={e => setShip(p => ({ ...p, thana: e.target.value }))}
                          placeholder="Search Thana / Upazila"
                          className={shipErrors.thana ? 'border-red-400' : ''}
                        />
                        <datalist id="thana-options">{thanas.map(thana => <option key={thana} value={thana} />)}</datalist>
                      </Field>
                    </div>

                  {/* Delivery charge display */}
                  <div className={`rounded-xl p-4 flex items-center gap-3 ${isDhaka(ship.district) ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-100'
                    }`}>
                    <Truck size={18} className={isDhaka(ship.district) ? 'text-blue-600' : 'text-orange-600'} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {isDhaka(ship.district) ? 'Dhaka' : 'Outside Dhaka'} Delivery
                      </p>
                      <p className="text-xs text-gray-500">
                        Charge: <strong>৳{shippingCost === 0 ? 'FREE' : shippingCost}</strong> •{' '}
                        Estimated: <strong>{isDhaka(ship.district) ? '2–3 business days' : '4–7 business days'}</strong>
                      </p>
                    </div>
                  </div>

                  {subtotal >= settings.freeShippingThreshold && (
                    <div className="bg-green-50 rounded-xl p-3 flex items-start gap-2 border border-green-100">
                      <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-green-700">
                        You qualified for free shipping! (Orders above ৳{settings.freeShippingThreshold.toLocaleString()})
                      </p>
                    </div>
                  )}
                </div>
                <NavButtons onBack={goBack} onNext={goNext} />
              </Card>
            )}

            {/* ── STEP: PAYMENT ── */}
            {step === 'payment' && (
              <Card icon={<CreditCard size={16} className="text-[#C4818A]" />} title="Payment Method">
                <div className="space-y-3 mb-2">
                  <PaymentOption
                    value="cod" selected={payment} onSelect={setPayment}
                    icon={<Truck size={20} className="text-green-600" />}
                    iconBg="bg-green-100"
                    label="Cash on Delivery"
                    description="Pay with cash when your order arrives at your door"
                  />
                  <PaymentOption
                    value="bkash" selected={payment} onSelect={setPayment}
                    icon={<span className="font-extrabold text-sm text-pink-600">bKash</span>}
                    iconBg="bg-pink-50"
                    label="bKash (Manual)"
                    description="Send payment to our bKash number, then confirm"
                  />
                  <PaymentOption
                    value="nagad" selected={payment} onSelect={setPayment}
                    icon={<span className="font-extrabold text-sm text-orange-600">Nagad</span>}
                    iconBg="bg-orange-50"
                    label="Nagad (Manual)"
                    description="Send payment to our Nagad number, then confirm"
                  />
                  <PaymentOption value="rocket" selected={payment} onSelect={setPayment} icon={<span className="font-extrabold text-sm text-violet-700">Rocket</span>} iconBg="bg-violet-50" label="Rocket" description="Pay by Rocket and submit your transaction ID" />
                  <PaymentOption value="bank" selected={payment} onSelect={setPayment} icon={<Landmark size={20} className="text-slate-600" />} iconBg="bg-slate-100" label="Bank Transfer" description="Transfer to our bank account and submit proof" />
                </div>

                {/* Manual payment instructions */}
                {(payment === 'bkash' || payment === 'nagad') && (
                  <div className={`rounded-xl p-4 mt-3 ${payment === 'bkash' ? 'bg-pink-50 border border-pink-100' : 'bg-orange-50 border border-orange-100'
                    }`}>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Payment Instructions</p>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>
                        Send <strong>৳{grandTotal.toLocaleString()}</strong> to{' '}
                        <strong className={payment === 'bkash' ? 'text-pink-700' : 'text-orange-700'}>
                          01712-012737
                        </strong>{' '}
                        ({payment === 'bkash' ? 'bKash' : 'Nagad'})
                      </li>
                      <li>Use <strong>Send Money</strong>, not payment</li>
                      <li>Note the transaction ID after payment</li>
                      <li>Your order will be confirmed once payment is verified</li>
                    </ol>
                  </div>
                )}

                {requiresAdvanceProof && (
                  <div className="rounded-xl p-4 mt-3 bg-rose-50 border border-rose-100">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Advance Payment Details</p>
                    {payment === 'bank' ? <div className="text-xs text-gray-700 space-y-1 mb-4"><p><strong>Bank Name:</strong> Beauty Dokan BD Bank</p><p><strong>Account Name:</strong> Beauty Dokan BD</p><p><strong>Account Number:</strong> 1234567890</p><p><strong>Routing Number:</strong> [REDACTED]</p></div> : <p className="text-xs text-gray-700 mb-4"><strong>Merchant Number:</strong> 01712-012737 ({payment === 'bkash' ? 'bKash' : payment === 'nagad' ? 'Nagad' : 'Rocket'})</p>}
                    <div className="grid sm:grid-cols-2 gap-3"><Field label="Transaction ID" required><Input value={paymentInfo.transactionId} onChange={e => setPaymentInfo(p => ({ ...p, transactionId: e.target.value }))} placeholder="Enter transaction ID" /></Field><Field label="Payment Screenshot"><label className="flex h-10 items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 cursor-pointer hover:border-[#C4818A] transition-colors text-xs text-gray-600"><Upload size={15} /> {paymentInfo.screenshotName || 'Upload JPG, PNG or PDF'}<input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" className="sr-only" onChange={e => handleScreenshot(e.target.files?.[0])} /></label></Field></div>
                  </div>
                )}

                <NavButtons onBack={goBack} onNext={goNext} />
              </Card>
            )}

            {/* ── STEP: REVIEW ── */}
            {step === 'review' && (
              <div className="space-y-4">
                {/* Delivering to */}
                <ReviewBlock
                  icon={<User size={15} className="text-[#C4818A]" />}
                  label="Customer"
                  onEdit={() => setStep('info')}
                >
                  <p className="font-semibold text-gray-900">{info.fullName}</p>
                  <p className="text-sm text-gray-600">{info.mobile}</p>
                  {info.email && <p className="text-sm text-gray-400">{info.email}</p>}
                </ReviewBlock>

                <ReviewBlock
                  icon={<MapPin size={15} className="text-[#C4818A]" />}
                  label="Delivery Address"
                  onEdit={() => setStep('shipping')}
                >
                  <p className="text-sm text-gray-700">{ship.address}</p>
                  <p className="text-sm text-gray-600">{ship.thana}, {ship.district}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {isDhaka(ship.district) ? '🚚 Dhaka • 2–3 business days' : '🚚 Outside Dhaka • 4–7 business days'}
                  </p>
                </ReviewBlock>

                <ReviewBlock
                  icon={<CreditCard size={15} className="text-[#C4818A]" />}
                  label="Payment"
                  onEdit={() => setStep('payment')}
                >
                  <p className="font-medium text-gray-900">
                    {payment === 'cod' ? 'Cash on Delivery' : payment === 'bkash' ? 'bKash' : payment === 'nagad' ? 'Nagad' : payment === 'rocket' ? 'Rocket' : 'Bank Transfer'}
                  </p>
                  {paymentInfo.transactionId && <p className="text-xs text-gray-500 mt-1">Transaction ID: {paymentInfo.transactionId}</p>}
                </ReviewBlock>

                <Card icon={<Package size={15} className="text-[#C4818A]" />} title="Order Note">
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Special delivery instructions..." className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </Card>

                {/* Items in review */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Package size={16} className="text-[#C4818A]" /> Items ({items.length})
                    </h3>
                    <button onClick={() => setStep('cart')} className="text-xs text-[#C4818A] hover:underline">Edit</button>
                  </div>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.product_id} className="flex gap-3 items-center">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#C4818A] font-medium">{item.product.brand}</p>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.product.price.toLocaleString()}</p>
                        </div>
                        <p className="font-semibold text-sm flex-shrink-0">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Final totals */}
                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({couponCode})</span>
                        <span>−৳{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery ({isDhaka(ship.district) ? 'Dhaka' : 'Outside Dhaka'})</span>
                      <span>{shippingCost === 0 ? 'FREE' : `৳${shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                      <span>Grand Total</span>
                      <span className="text-[#C4818A]">৳{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={goBack} className="flex-1 rounded-xl h-12">
                    <ChevronLeft size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    onClick={placeOrder}
                    disabled={loading}
                    className="flex-1 bg-[#C4818A] hover:bg-[#B06E77] text-white rounded-xl h-12 font-semibold text-base"
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin mr-2" />Placing Order…</>
                      : `Place Order • ৳${grandTotal.toLocaleString()}`
                    }
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right / summary column ── */}
          <div className="lg:col-span-1 max-lg:sticky max-lg:bottom-0 max-lg:z-20 max-lg:pb-2">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              discount={discount}
              couponCode={couponCode}
              couponApplied={couponApplied}
              couponError={couponError}
              onCouponChange={handleCouponChange}
              onApplyCoupon={applyCoupon}
              showCoupon={step !== 'cart'}
              payment={payment}
              coupons={coupons}
              freeShippingThreshold={settings.freeShippingThreshold}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ClientWrapper>
      <CheckoutContent />
    </ClientWrapper>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function NavButtons({ onBack, onNext, isFirst }: { onBack: () => void; onNext: () => void; isFirst?: boolean }) {
  return (
    <div className="flex gap-3 mt-6">
      {!isFirst && (
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl h-11">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
      )}
      <Button
        onClick={onNext}
        className={`${isFirst ? 'w-full' : 'flex-1'} bg-[#C4818A] hover:bg-[#B06E77] text-white rounded-xl h-11 font-semibold`}
      >
        Continue <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  );
}

function ZoneChip({ label, sub, active, color }: {
  label: string; sub: string; active: boolean; color: 'blue' | 'orange';
}) {
  const ring = color === 'blue' ? 'border-blue-400 bg-blue-50' : 'border-orange-400 bg-orange-50';
  const muted = color === 'blue' ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-gray-50';
  const dot = color === 'blue' ? 'bg-blue-500' : 'bg-orange-500';
  return (
    <div className={`flex-1 rounded-xl border-2 p-3 transition-all ${active ? ring : muted}`}>
      <div className="flex items-center gap-2 mb-0.5">
        {active && <span className={`w-2 h-2 rounded-full ${dot}`} />}
        <p className={`text-xs font-semibold ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
      </div>
      <p className={`text-xs ${active ? 'text-gray-600' : 'text-gray-400'}`}>{sub}</p>
    </div>
  );
}

function ReviewBlock({ icon, label, onEdit, children }: {
  icon: React.ReactNode; label: string; onEdit: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</span>
        </div>
        <button onClick={onEdit} className="text-xs text-[#C4818A] hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}
