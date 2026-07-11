'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CircleCheck as CheckCircle2, Package, Truck, MapPin, CreditCard, ArrowRight, Copy, Check, Download, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';

const ORDERS_KEY = 'beautydokanbd_orders';

const PAYMENT_LABEL: Record<string, string> = {
  cod: 'Cash on Delivery',
  bkash: 'bKash (Manual)',
  nagad: 'Nagad (Manual)',
};

// ─── Invoice HTML ─────────────────────────────────────────────────────────────

function buildInvoiceHTML(order: any): string {
  const payLabel = PAYMENT_LABEL[order.payment_method] ?? order.payment_method;
  const rows = order.items.map((item: any, i: number) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0">${i + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0">
        <strong>${item.product_name}</strong><br/>
        <span style="color:#999;font-size:12px">${item.brand}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right">৳${item.price.toLocaleString()}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right">৳${item.subtotal.toLocaleString()}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice – ${order.order_number}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;color:#333;background:#f5f5f5;padding:20px}
  .inv{max-width:720px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#C4818A,#B06E77);color:#fff;padding:32px 40px;display:flex;justify-content:space-between;align-items:center}
  .hdr h1{font-size:26px;font-weight:700}
  .hdr .sub{font-size:13px;opacity:.8;margin-top:3px}
  .oid .lbl{font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:.75}
  .oid .val{font-size:17px;font-weight:700;font-family:monospace;margin-top:3px}
  .sec{padding:24px 40px}
  .sec-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#bbb;margin-bottom:8px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  .info p{font-size:14px;line-height:1.65}
  .info .name{font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th{text-align:left;padding:10px 12px;background:#fafafa;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888;border-bottom:2px solid #eee}
  td{font-size:14px}
  .totals{margin:16px 0 0 auto;width:280px}
  .totals .row{display:flex;justify-content:space-between;padding:5px 0;font-size:14px}
  .totals .grand{border-top:2px solid #C4818A;margin-top:8px;padding-top:12px;font-size:18px;font-weight:700;color:#C4818A}
  .ftr{padding:20px 40px 32px;text-align:center;font-size:13px;color:#aaa}
  .ftr .brand{font-weight:700;color:#C4818A}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#fef3c7;color:#92400e}
  @media print{body{background:#fff;padding:0}.inv{box-shadow:none}}
</style>
</head>
<body>
<div class="inv">
  <div class="hdr">
    <div><h1>Beauty Dokan BD</h1><div class="sub">Premium Beauty &amp; Skincare</div></div>
    <div class="oid"><div class="lbl">Order ID</div><div class="val">${order.order_number}</div></div>
  </div>
  <div class="sec">
    <div class="grid2">
      <div class="info">
        <div class="sec-title">Billed To</div>
        <p class="name">${order.shipping_address.name}</p>
        <p>${order.shipping_address.phone}</p>
        ${order.shipping_address.email ? `<p>${order.shipping_address.email}</p>` : ''}
      </div>
      <div class="info">
        <div class="sec-title">Delivery Address</div>
        <p>${order.shipping_address.address}</p>
        <p>${order.shipping_address.area}, ${order.shipping_address.district}</p>
        ${order.shipping_address.postal_code ? `<p>Postal: ${order.shipping_address.postal_code}</p>` : ''}
      </div>
    </div>
    <div class="grid2" style="margin-top:16px">
      <div class="info">
        <div class="sec-title">Order Date</div>
        <p>${new Date(order.created_at).toLocaleString()}</p>
      </div>
      <div class="info">
        <div class="sec-title">Payment</div>
        <p>${payLabel}</p>
      </div>
    </div>
    <div style="margin-top:12px"><span class="badge">Status: ${order.status}</span></div>
  </div>
  <div class="sec" style="padding-top:0">
    <div class="sec-title">Order Items</div>
    <table>
      <thead><tr>
        <th>#</th><th>Product</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Subtotal</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>৳${order.subtotal.toLocaleString()}</span></div>
      ${order.discount > 0 ? `<div class="row"><span>Discount</span><span style="color:#16a34a">−৳${order.discount.toLocaleString()}</span></div>` : ''}
      <div class="row"><span>Shipping</span><span>৳${order.shipping.toLocaleString()}</span></div>
      <div class="row grand"><span>Grand Total</span><span>৳${order.total.toLocaleString()}</span></div>
    </div>
  </div>
  <div class="ftr">
    <p>Thank you for shopping with <span class="brand">Beauty Dokan BD</span></p>
    <p style="margin-top:4px">beautydokanbd.online@gmail.com • 01712-012737</p>
    <p style="margin-top:8px;font-size:11px">System-generated invoice – no signature required.</p>
  </div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`;
}

// ─── Page content ─────────────────────────────────────────────────────────────

function SuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder]   = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const orderNumber = searchParams.get('order');

  useEffect(() => {
    if (!orderNumber) return;
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) {
        const orders = JSON.parse(stored);
        const found = orders.find((o: any) => o.order_number === orderNumber);
        if (found) setOrder(found);
      }
    } catch { /* ignore */ }
  }, [orderNumber]);

  const copyOrder = () => {
    navigator.clipboard.writeText(orderNumber ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadInvoice = () => {
    if (!order) return;
    const blob = new Blob([buildInvoiceHTML(order)], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const payLabel = order ? (PAYMENT_LABEL[order.payment_method] ?? order.payment_method) : '—';

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* ── Thank you ── */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-green-600" size={44} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you{order ? `, ${order.shipping_address.name}` : ''}!
          Your order has been confirmed and is being processed.
        </p>
      </div>

      {/* ── Order ID card ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-xl font-mono font-bold text-gray-900">{orderNumber}</p>
            <p className="text-xs text-gray-400 mt-1">
              Placed on {order ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={copyOrder} className="flex-shrink-0">
            {copied ? <Check size={14} className="mr-1.5 text-green-600" /> : <Copy size={14} className="mr-1.5" />}
            {copied ? 'Copied!' : 'Copy ID'}
          </Button>
        </div>

        {order && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Status', value: <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span> },
              { label: 'Payment', value: <span className="text-sm font-medium">{payLabel}</span> },
              { label: 'Shipping', value: <span className="text-sm font-medium">৳{order.shipping}</span> },
              { label: 'Grand Total', value: <span className="text-sm font-bold text-[#C4818A]">৳{order.total.toLocaleString()}</span> },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                {value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Estimated delivery ── */}
      {order?.estimated_delivery && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 flex items-center gap-3">
          <Calendar className="text-blue-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
            <p className="text-sm text-blue-700 font-medium">{order.estimated_delivery}</p>
          </div>
        </div>
      )}

      {/* ── Order timeline ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-5">
        <h2 className="font-semibold text-gray-900 mb-4">Order Progress</h2>
        {[
          { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Order Placed',       sub: order ? new Date(order.created_at).toLocaleString() : '', done: true },
          { icon: Package,      color: 'text-gray-400',  bg: 'bg-gray-100',  label: 'Processing',         sub: 'Our team is reviewing your order',                       done: false },
          { icon: Truck,        color: 'text-gray-400',  bg: 'bg-gray-100',  label: 'Out for Delivery',   sub: order?.estimated_delivery ?? 'Pending',                   done: false },
          { icon: MapPin,       color: 'text-gray-400',  bg: 'bg-gray-100',  label: 'Delivered',          sub: 'Pending',                                                done: false },
        ].map(({ icon: Icon, color, bg, label, sub, done }) => (
          <div key={label} className="flex gap-3 mb-4 last:mb-0">
            <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={16} className={color} />
            </div>
            <div className={done ? '' : 'opacity-45'}>
              <p className="font-medium text-sm text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Ordered products ── */}
      {order?.items?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ordered Products ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#C4818A] font-medium">{item.brand}</p>
                  <p className="font-medium text-sm text-gray-900 line-clamp-1">{item.product_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                </div>
                <p className="font-semibold text-sm text-gray-900 flex-shrink-0">
                  ৳{item.subtotal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping Cost</span>
              <span>
                {order.shipping === 0
                  ? <span className="text-green-600 font-medium">FREE</span>
                  : `৳${order.shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-[#C4818A]">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Delivery address ── */}
      {order?.shipping_address && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-5">
          <h2 className="font-semibold text-gray-900 mb-3">Delivery Address</h2>
          <div className="flex gap-3">
            <MapPin className="text-[#C4818A] flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm space-y-0.5">
              <p className="font-semibold text-gray-900">{order.shipping_address.name}</p>
              <p className="text-gray-600">{order.shipping_address.phone}</p>
              {order.shipping_address.email && (
                <p className="text-gray-400">{order.shipping_address.email}</p>
              )}
              <p className="text-gray-600">
                {order.shipping_address.address}, {order.shipping_address.area},{' '}
                {order.shipping_address.district}
                {order.shipping_address.postal_code ? ` – ${order.shipping_address.postal_code}` : ''}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Zone: {order.shipping_address.zone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment method ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-5">
        <h2 className="font-semibold text-gray-900 mb-3">Payment Method</h2>
        <div className="flex gap-3 items-start">
          <CreditCard className="text-[#C4818A] flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-gray-900">{payLabel}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {order?.payment_method === 'cod'
                ? 'Pay with cash when your order arrives at your door.'
                : 'Please complete your manual payment. Your order will be confirmed after verification.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-[#C4818A] hover:bg-[#B06E77] h-11 rounded-xl font-semibold">
            <Link href="/shop">
              <ShoppingBag size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" onClick={downloadInvoice} className="flex-1 h-11 rounded-xl">
            <Download size={16} className="mr-2" />
            Download Invoice
          </Button>
        </div>
        <Button variant="ghost" asChild className="w-full h-10">
          <Link href="/">
            Back to Home
            <ArrowRight size={15} className="ml-1.5" />
          </Link>
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
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={40} />
            </div>
            <p className="text-gray-500">Loading your order…</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
        <Footer />
      </div>
    </ClientWrapper>
  );
}
