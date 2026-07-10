'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CircleCheck as CheckCircle2, Package, Truck, MapPin, CreditCard, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';

const ORDERS_STORAGE_KEY = 'beautydokanbd_orders';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const orderNumber = searchParams.get('order');

  useEffect(() => {
    if (!orderNumber) return;
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      const found = orders.find((o: any) => o.order_number === orderNumber);
      if (found) setOrder(found);
    }
  }, [orderNumber]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-lg font-mono font-semibold">{orderNumber}</p>
          </div>
          <Button variant="outline" size="sm" onClick={copyOrderNumber}>
            {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        {order && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Date</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Status</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Payment</p>
                <p className="font-medium capitalize">
                  {order.payment_method === 'cod' ? 'Cash on Delivery'
                    : order.payment_method === 'bkash' ? 'bKash'
                    : 'Nagad'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Total</p>
                <p className="font-semibold text-[#C4818A]">৳{order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold mb-4">Order Timeline</h2>
        <div className="space-y-4">
          {[
            { icon: <CheckCircle2 className="text-green-600" size={16} />, bg: 'bg-green-100', label: 'Order Placed', sub: new Date().toLocaleString(), active: true },
            { icon: <Package className="text-gray-400" size={16} />, bg: 'bg-gray-100', label: 'Processing', sub: 'Pending', active: false },
            { icon: <Truck className="text-gray-400" size={16} />, bg: 'bg-gray-100', label: 'Out for Delivery', sub: 'Pending', active: false },
            { icon: <MapPin className="text-gray-400" size={16} />, bg: 'bg-gray-100', label: 'Delivered', sub: 'Pending', active: false },
          ].map(step => (
            <div key={step.label} className="flex gap-3">
              <div className={`w-8 h-8 rounded-full ${step.bg} flex items-center justify-center flex-shrink-0`}>{step.icon}</div>
              <div className={step.active ? '' : 'text-gray-400'}>
                <p className="font-medium text-sm">{step.label}</p>
                <p className="text-xs">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      {order?.items?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold mb-4">Order Items ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#C4818A]">{item.brand}</p>
                  <p className="font-medium text-sm line-clamp-1">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-sm">৳{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery address */}
      {order?.shipping_address && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold mb-4">Delivery Address</h2>
          <div className="flex gap-3">
            <MapPin className="text-[#C4818A] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium">{order.shipping_address.name}</p>
              <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
              <p className="text-sm text-gray-500">
                {order.shipping_address.address}, {order.shipping_address.delivery_area}, {order.shipping_address.district}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold mb-4">Payment Method</h2>
        <div className="flex gap-3 items-center">
          <CreditCard className="text-[#C4818A]" size={20} />
          <div>
            <p className="font-medium">
              {order?.payment_method === 'cod' ? 'Cash on Delivery'
                : order?.payment_method === 'bkash' ? 'bKash'
                : order?.payment_method === 'nagad' ? 'Nagad'
                : 'Cash on Delivery'}
            </p>
            <p className="text-sm text-gray-500">
              {order?.payment_method === 'cod'
                ? 'Pay with cash when your order arrives'
                : 'Payment will be confirmed by our team'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1 bg-[#C4818A] hover:bg-[#B06E77]">
          <Link href="/shop">
            Continue Shopping
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Suspense fallback={
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={40} />
            </div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
        <Footer />
      </div>
    </ClientWrapper>
  );
}
