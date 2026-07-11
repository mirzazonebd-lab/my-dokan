'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, Loader as Loader2, User, Phone, Mail, MapPin, Truck, CreditCard, ShoppingBag, Tag, Sparkles, Package } from 'lucide-react';
import { useCart } from '@/components/cart/CartStore';
import { BANGLADESH_DISTRICTS } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDERS_KEY = 'beautydokanbd_orders';

const DHAKA_AREAS = [
  'Mirpur', 'Mohammadpur', 'Gulshan', 'Banani', 'Uttara', 'Dhanmondi',
  'Motijheel', 'Old Dhaka', 'Rampura', 'Badda', 'Khilgaon', 'Shyamoli',
  'Azimpur', 'Wari', 'Lalbagh', 'Tejgaon', 'Farmgate', 'Mohakhali',
  'Bashundhara', 'Baridhara', 'Pallabi', 'Turag', 'Demra', 'Jurain',
];

const DISTRICT_AREAS: Record<string, string[]> = {
  Dhaka: DHAKA_AREAS,
  Gazipur: ['Tongi', 'Joydebpur', 'Kaliakair', 'Sreepur', 'Kapasia'],
  Narayanganj: ['Narayanganj City', 'Siddhirganj', 'Araihazar', 'Bandar', 'Rupganj'],
  Chittagong: ['Agrabad', 'GEC Circle', 'Nasirabad', 'Halishahar', 'Pahartali', 'Patenga', 'Khulshi', 'Chawkbazar'],
  Khulna: ['Boyra', 'Khalishpur', 'Sonadanga', 'Daulatpur', 'Khulna City', 'Rupsha'],
  Rajshahi: ['City Centre', 'Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Paba'],
  Sylhet: ['Sylhet City', 'Zindabazar', 'Ambarkhana', 'Shibganj', 'Subidbazar'],
  Barisal: ['Barisal City', 'Sadar', 'Wazirpur', 'Agailjhara', 'Babuganj'],
  Mymensingh: ['Mymensingh City', 'Trishal', 'Bhaluka', 'Muktagacha', 'Fulbaria'],
};

const INSIDE_DHAKA_DISTRICTS = ['Dhaka', 'Gazipur', 'Narayanganj'];
const SHIPPING_INSIDE  = 60;
const SHIPPING_OUTSIDE = 120;

const COUPONS: Record<string, number> = { WELCOME10: 10, SKIN20: 20, BEAUTY15: 15 };

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'cart' | 'info' | 'shipping' | 'payment' | 'review';
type PaymentMethod = 'cod' | 'bkash' | 'nagad';

interface CustomerInfo {
  fullName: string;
  mobile: string;
  email: string;
}

interface ShippingInfo {
  address: string;
  district: string;
  area: string;
  postalCode: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STEPS: Step[] = ['cart', 'info', 'shipping', 'payment', 'review'];
const STEP_LABELS: Record<Step, string> = {
  cart: 'Cart', info: 'Information', shipping: 'Shipping', payment: 'Payment', review: 'Review',
};

function calcShipping(district: string): number {
  return INSIDE_DHAKA_DISTRICTS.includes(district) ? SHIPPING_INSIDE : SHIPPING_OUTSIDE;
}

function getAreas(district: string): string[] {
  return DISTRICT_AREAS[district] ?? ['City Centre', 'Sadar', 'Upazila Area'];
}

function genOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BD${ts}${rand}`;
}

function isInsideDhaka(district: string) {
  return INSIDE_DHAKA_DISTRICTS.includes(district);
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? 'bg-green-500 text-white' :
                active ? 'bg-[#C4818A] text-white ring-4 ring-[#C4818A]/20' :
                         'bg-gray-200 text-gray-400'
              }`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                active ? 'text-[#C4818A]' : done ? 'text-green-600' : 'text-gray-400'
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
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
        active ? 'border-[#C4818A] bg-rose-50' : 'border-gray-200 hover:border-rose-200 bg-white'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        active ? 'border-[#C4818A] bg-[#C4818A]' : 'border-gray-300'
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
  showCoupon,
}: {
  items: any[]; subtotal: number; shippingCost: number; discount: number;
  couponCode: string; couponApplied: boolean; couponError: string;
  onCouponChange: (v: string) => void; onApplyCoupon: () => void;
  showCoupon: boolean;
}) {
  const grandTotal = subtotal + shippingCost - discount;
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
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>−৳{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
            {shippingCost === 0 ? 'FREE' : `৳${shippingCost}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2.5 border-t border-gray-100">
          <span>Grand Total</span>
          <span className="text-[#C4818A]">৳{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {shippingCost > 0 && (
        <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2">
          <Sparkles size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            {INSIDE_DHAKA_DISTRICTS.some(d => d === 'Dhaka')
              ? `Inside Dhaka: ৳${SHIPPING_INSIDE} • Outside Dhaka: ৳${SHIPPING_OUTSIDE}`
              : 'Delivery charge calculated by location'}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep]             = useState<Step>('cart');
  const [mounted, setMounted]       = useState(false);
  const [loading, setLoading]       = useState(false);

  // Customer info
  const [info, setInfo]             = useState<CustomerInfo>({ fullName: '', mobile: '', email: '' });
  const [infoErrors, setInfoErrors] = useState<Partial<CustomerInfo>>({});

  // Shipping
  const [ship, setShip]             = useState<ShippingInfo>({ address: '', district: 'Dhaka', area: '', postalCode: '' });
  const [shipErrors, setShipErrors] = useState<Partial<ShippingInfo>>({});

  // Payment
  const [payment, setPayment]       = useState<PaymentMethod>('cod');

  // Coupon
  const [couponCode, setCouponCode]       = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError]     = useState('');
  const [discount, setDiscount]           = useState(0);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && items.length === 0 && step !== 'review') router.push('/shop');
  }, [mounted, items.length, step, router]);

  const shippingCost = ship.district ? calcShipping(ship.district) : SHIPPING_INSIDE;
  const grandTotal   = subtotal + shippingCost - discount;
  const areas        = getAreas(ship.district);

  // ── Coupon ──
  const applyCoupon = useCallback(() => {
    const pct = COUPONS[couponCode];
    if (pct) {
      setCouponApplied(true);
      setDiscount(Math.round(subtotal * (pct / 100)));
      setCouponError('');
    } else {
      setCouponApplied(false);
      setDiscount(0);
      setCouponError('Invalid coupon code');
    }
  }, [couponCode, subtotal]);

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
    else if (!/^(?:\+?880|0)1[3-9]\d{8}$/.test(info.mobile.replace(/[\s-]/g, '')))
      e.mobile = 'Enter a valid Bangladeshi mobile number';
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))
      e.email = 'Enter a valid email address';
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateShipping = (): boolean => {
    const e: Partial<ShippingInfo> = {};
    if (!ship.address.trim()) e.address = 'Delivery address is required';
    if (!ship.area) e.area = 'Please select an area';
    setShipErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ──
  const goNext = () => {
    if (step === 'cart')     { setStep('info'); window.scrollTo(0, 0); }
    if (step === 'info')     { if (validateInfo())     { setStep('shipping'); window.scrollTo(0, 0); } }
    if (step === 'shipping') { if (validateShipping()) { setStep('payment');  window.scrollTo(0, 0); } }
    if (step === 'payment')  { setStep('review'); window.scrollTo(0, 0); }
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) { setStep(STEPS[idx - 1]); window.scrollTo(0, 0); }
  };

  // ── Place order ──
  const placeOrder = async () => {
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
        payment_status: 'pending',
        shipping_address: {
          name: info.fullName,
          phone: info.mobile,
          email: info.email || null,
          address: ship.address,
          area: ship.area,
          district: ship.district,
          postal_code: ship.postalCode || null,
          zone: isInsideDhaka(ship.district) ? 'inside_dhaka' : 'outside_dhaka',
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
        estimated_delivery: isInsideDhaka(ship.district)
          ? '2–3 business days'
          : '4–7 business days',
        created_at: new Date().toISOString(),
      };

      const existing = localStorage.getItem(ORDERS_KEY);
      const orders   = existing ? JSON.parse(existing) : [];
      orders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      await clearCart();
      router.push(`/checkout/success?order=${orderNumber}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;
  if (items.length === 0 && step !== 'review') return null;

  return (
    <ClientWrapper>
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
                      sub={`৳${SHIPPING_INSIDE} delivery`}
                      active={isInsideDhaka(ship.district)}
                      color="blue"
                    />
                    <ZoneChip
                      label="Outside Dhaka"
                      sub={`৳${SHIPPING_OUTSIDE} delivery`}
                      active={!isInsideDhaka(ship.district)}
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
                        <select
                          value={ship.district}
                          onChange={e => setShip(p => ({ ...p, district: e.target.value, area: '' }))}
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {BANGLADESH_DISTRICTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Area" required error={shipErrors.area}>
                        <select
                          value={ship.area}
                          onChange={e => setShip(p => ({ ...p, area: e.target.value }))}
                          className={`w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                            shipErrors.area ? 'border-red-400' : 'border-input'
                          }`}
                        >
                          <option value="">Select area</option>
                          {areas.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </Field>
                    </div>

                    <Field label="Postal Code">
                      <Input
                        value={ship.postalCode}
                        onChange={e => setShip(p => ({ ...p, postalCode: e.target.value }))}
                        placeholder="e.g. 1216"
                        className="w-full sm:w-40"
                      />
                    </Field>

                    {/* Delivery charge display */}
                    <div className={`rounded-xl p-4 flex items-center gap-3 ${
                      isInsideDhaka(ship.district) ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-100'
                    }`}>
                      <Truck size={18} className={isInsideDhaka(ship.district) ? 'text-blue-600' : 'text-orange-600'} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {isInsideDhaka(ship.district) ? 'Inside Dhaka' : 'Outside Dhaka'} Delivery
                        </p>
                        <p className="text-xs text-gray-500">
                          Charge: <strong>৳{shippingCost}</strong> •{' '}
                          Estimated: <strong>{isInsideDhaka(ship.district) ? '2–3 business days' : '4–7 business days'}</strong>
                        </p>
                      </div>
                    </div>
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
                  </div>

                  {/* Manual payment instructions */}
                  {(payment === 'bkash' || payment === 'nagad') && (
                    <div className={`rounded-xl p-4 mt-3 ${
                      payment === 'bkash' ? 'bg-pink-50 border border-pink-100' : 'bg-orange-50 border border-orange-100'
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
                    <p className="text-sm text-gray-600">{ship.area}, {ship.district}{ship.postalCode ? ` – ${ship.postalCode}` : ''}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isInsideDhaka(ship.district) ? '🚚 Inside Dhaka • 2–3 business days' : '🚚 Outside Dhaka • 4–7 business days'}
                    </p>
                  </ReviewBlock>

                  <ReviewBlock
                    icon={<CreditCard size={15} className="text-[#C4818A]" />}
                    label="Payment"
                    onEdit={() => setStep('payment')}
                  >
                    <p className="font-medium text-gray-900">
                      {payment === 'cod' ? 'Cash on Delivery' : payment === 'bkash' ? 'bKash (Manual)' : 'Nagad (Manual)'}
                    </p>
                  </ReviewBlock>

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
                        <span>Delivery ({isInsideDhaka(ship.district) ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                        <span>৳{shippingCost}</span>
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
            <div className="lg:col-span-1">
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
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
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
  const ring  = color === 'blue'   ? 'border-blue-400 bg-blue-50'   : 'border-orange-400 bg-orange-50';
  const muted = color === 'blue'   ? 'border-gray-200 bg-gray-50'   : 'border-gray-200 bg-gray-50';
  const dot   = color === 'blue'   ? 'bg-blue-500'                  : 'bg-orange-500';
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
