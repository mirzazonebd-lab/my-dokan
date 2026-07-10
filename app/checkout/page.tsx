'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, MapPin, CreditCard, Truck, Tag, Check, Loader as Loader2, User, Phone, Mail, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/components/cart/CartStore';
import { BANGLADESH_DISTRICTS } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';

const ORDERS_STORAGE_KEY = 'beautydokanbd_orders';

const DELIVERY_AREAS: Record<string, string[]> = {
  Dhaka: ['Mirpur', 'Mohammadpur', 'Gulshan', 'Banani', 'Uttara', 'Dhanmondi', 'Motijheel', 'Old Dhaka', 'Rampura', 'Badda', 'Khilgaon', 'Shyamoli', 'Azimpur', 'Wari', 'Lalbagh'],
  Chittagong: ['Agrabad', 'GEC Circle', 'Nasirabad', 'Halishahar', 'Pahartali', 'Patenga', 'Khulshi', 'Bayazid', 'Chawkbazar', 'Kotwali'],
  Khulna: ['Boyra', 'Khalishpur', 'Sonadanga', 'Daulatpur', 'Khulna City', 'Rupsha'],
  Rajshahi: ['City Centre', 'Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Paba'],
  Sylhet: ['Sylhet City', 'Zindabazar', 'Ambarkhana', 'Shibganj', 'Subidbazar'],
  Gazipur: ['Tongi', 'Joydebpur', 'Kaliakair', 'Sreepur', 'Kapasia'],
  Narayanganj: ['Narayanganj City', 'Siddhirganj', 'Araihazar', 'Bandar', 'Rupganj'],
};

const DEFAULT_AREAS = ['City Centre', 'Sadar', 'Upazila Area'];

type PaymentMethod = 'cod' | 'bkash' | 'nagad';

interface GuestForm {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  deliveryArea: string;
}

const EMPTY_FORM: GuestForm = {
  fullName: '',
  mobile: '',
  email: '',
  address: '',
  district: 'Dhaka',
  deliveryArea: '',
};

const COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SKIN20: 20,
  BEAUTY15: 15,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();

  const [form, setForm] = useState<GuestForm>(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<GuestForm>>({});
  const [step, setStep] = useState<'details' | 'review'>('details');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/shop');
    }
  }, [mounted, items.length, router]);

  const deliveryAreas = DELIVERY_AREAS[form.district] ?? DEFAULT_AREAS;
  const finalTotal = total - discount;

  const setField = (key: keyof GuestForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    if (key === 'district') setForm(prev => ({ ...prev, district: value, deliveryArea: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<GuestForm> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^(?:\+?880|0)1[3-9]\d{8}$/.test(form.mobile.replace(/[\s-]/g, '')))
      newErrors.mobile = 'Enter a valid Bangladeshi mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email address';
    if (!form.address.trim()) newErrors.address = 'Delivery address is required';
    if (!form.deliveryArea) newErrors.deliveryArea = 'Please select a delivery area';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyCoupon = () => {
    const pct = COUPONS[couponCode.toUpperCase()];
    if (pct) {
      setCouponApplied(true);
      setDiscount(Math.round(subtotal * (pct / 100)));
      setCouponError('');
    } else {
      setCouponApplied(false);
      setDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };

  const handleProceedToReview = () => {
    if (validate()) setStep('review');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      const orderNumber = `BD${timestamp}${random}`;

      const order = {
        id: `order-${Date.now()}`,
        user_id: 'guest',
        order_number: orderNumber,
        status: 'pending' as const,
        subtotal,
        discount,
        shipping,
        total: finalTotal,
        coupon_code: couponApplied ? couponCode.toUpperCase() : null,
        payment_method: paymentMethod,
        payment_status: 'pending' as const,
        shipping_address: {
          name: form.fullName,
          phone: form.mobile,
          email: form.email || null,
          address: form.address,
          district: form.district,
          delivery_area: form.deliveryArea,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.unshift(order);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

      await clearCart();
      router.push(`/checkout/success?order=${orderNumber}`);
    } catch (err) {
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-gray-700">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'details' ? 'bg-[#C4818A] text-white' : 'bg-green-500 text-white'}`}>
                {step === 'review' ? <Check size={16} /> : '1'}
              </div>
              <span className={`text-sm font-medium ${step === 'details' ? 'text-gray-900' : 'text-gray-500'}`}>Your Details</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 max-w-16" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'review' ? 'bg-[#C4818A] text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${step === 'review' ? 'text-gray-900' : 'text-gray-400'}`}>Review & Pay</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {step === 'details' && (
                <>
                  {/* Contact Details */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-[#C4818A]" />
                      </div>
                      <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.fullName}
                          onChange={e => setField('fullName', e.target.value)}
                          placeholder="e.g. Rahim Ahmed"
                          className={errors.fullName ? 'border-red-400 focus:ring-red-400' : ''}
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              value={form.mobile}
                              onChange={e => setField('mobile', e.target.value)}
                              placeholder="01700-000000"
                              className={`pl-9 ${errors.mobile ? 'border-red-400' : ''}`}
                            />
                          </div>
                          {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email <span className="text-gray-400 text-xs font-normal">(optional)</span>
                          </label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="email"
                              value={form.email}
                              onChange={e => setField('email', e.target.value)}
                              placeholder="email@example.com"
                              className={`pl-9 ${errors.email ? 'border-red-400' : ''}`}
                            />
                          </div>
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                        <MapPin size={16} className="text-[#C4818A]" />
                      </div>
                      <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.address}
                          onChange={e => setField('address', e.target.value)}
                          placeholder="House/Flat no., Road no., Area"
                          className={errors.address ? 'border-red-400' : ''}
                        />
                        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            District <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={form.district}
                            onChange={e => setField('district', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {BANGLADESH_DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Delivery Area <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={form.deliveryArea}
                            onChange={e => setField('deliveryArea', e.target.value)}
                            className={`w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                              errors.deliveryArea ? 'border-red-400' : 'border-input'
                            }`}
                          >
                            <option value="">Select area</option>
                            {deliveryAreas.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                          {errors.deliveryArea && <p className="text-xs text-red-500 mt-1">{errors.deliveryArea}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                        <CreditCard size={16} className="text-[#C4818A]" />
                      </div>
                      <h2 className="text-base font-semibold text-gray-900">Payment Method</h2>
                    </div>

                    <div className="space-y-3">
                      <PaymentOption
                        value="cod"
                        selected={paymentMethod}
                        onSelect={setPaymentMethod}
                        icon={<Truck size={22} className="text-green-600" />}
                        iconBg="bg-green-100"
                        label="Cash on Delivery"
                        description="Pay with cash when your order arrives"
                      />
                      <PaymentOption
                        value="bkash"
                        selected={paymentMethod}
                        onSelect={setPaymentMethod}
                        icon={<span className="font-bold text-sm text-pink-600">bKash</span>}
                        iconBg="bg-pink-100"
                        label="bKash"
                        description="Pay securely with bKash mobile wallet"
                      />
                      <PaymentOption
                        value="nagad"
                        selected={paymentMethod}
                        onSelect={setPaymentMethod}
                        icon={<span className="font-bold text-sm text-orange-600">Nagad</span>}
                        iconBg="bg-orange-100"
                        label="Nagad"
                        description="Pay securely with Nagad mobile wallet"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToReview}
                    className="w-full bg-[#C4818A] hover:bg-[#B06E77] text-white h-12 text-base font-semibold rounded-xl"
                  >
                    Review Order
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                </>
              )}

              {step === 'review' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag size={18} className="text-[#C4818A]" />
                    <h2 className="text-base font-semibold text-gray-900">Order Review</h2>
                  </div>

                  {/* Shipping summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Delivering To</p>
                    <p className="font-semibold text-gray-900">{form.fullName}</p>
                    <p className="text-sm text-gray-600">{form.mobile}</p>
                    {form.email && <p className="text-sm text-gray-500">{form.email}</p>}
                    <p className="text-sm text-gray-500">{form.address}, {form.deliveryArea}, {form.district}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Payment</p>
                    <p className="font-medium text-gray-900">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Items ({items.length})</p>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.product_id} className="flex gap-3 items-center">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#C4818A] font-medium">{item.product.brand}</p>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                            ৳{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('details')}
                      className="flex-1 rounded-xl"
                    >
                      Edit Details
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-[#C4818A] hover:bg-[#B06E77] text-white rounded-xl font-semibold"
                    >
                      {loading ? (
                        <><Loader2 size={16} className="animate-spin mr-2" />Placing Order...</>
                      ) : (
                        `Place Order • ৳${finalTotal.toLocaleString()}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

                {/* Items list */}
                <div className="space-y-3">
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
                      </div>
                      <p className="text-sm font-medium flex-shrink-0">৳{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={couponCode}
                        onChange={e => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponApplied(false);
                          setDiscount(0);
                          setCouponError('');
                        }}
                        placeholder="Coupon code"
                        className="pl-8 text-sm"
                      />
                    </div>
                    <Button onClick={applyCoupon} variant="outline" className="px-3 text-sm">Apply</Button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                      <Check size={12} /> Coupon applied — you save ৳{discount}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600 font-medium">−৳{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `৳${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2.5 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-[#C4818A]">৳{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Free shipping nudge */}
                {shipping > 0 && (
                  <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2">
                    <Sparkles size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Add <strong>৳{(1500 - subtotal).toLocaleString()}</strong> more for free delivery!
                    </p>
                  </div>
                )}

                {shipping === 0 && (
                  <div className="bg-green-50 rounded-xl p-3 flex items-start gap-2">
                    <Truck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-700 font-medium">You qualify for free delivery!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ClientWrapper>
  );
}

interface PaymentOptionProps {
  value: PaymentMethod;
  selected: PaymentMethod;
  onSelect: (v: PaymentMethod) => void;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  description: string;
}

function PaymentOption({ value, selected, onSelect, icon, iconBg, label, description }: PaymentOptionProps) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
        isSelected ? 'border-[#C4818A] bg-rose-50' : 'border-gray-200 hover:border-rose-200 bg-white'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        isSelected ? 'border-[#C4818A] bg-[#C4818A]' : 'border-gray-300'
      }`}>
        {isSelected && <Check size={11} className="text-white" />}
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
