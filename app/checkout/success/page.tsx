'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CircleCheck as CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowRight,
  Copy,
  Check,
  Download,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/ClientWrapper';

const ORDERS_STORAGE_KEY = 'beautydokanbd_orders';
const WHATSAPP_NUMBER = '8801712012737';

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

  const paymentLabel = (method: string) => {
    if (method === 'cod') return 'Cash on Delivery';
    if (method === 'bkash') return 'bKash';
    if (method === 'nagad') return 'Nagad';
    return method;
  };

  const buildWhatsAppMessage = () => {
    if (!order) return '';
    const lines: string[] = [];
    lines.push('*New Order - Beauty Dokan BD*');
    lines.push('');
    lines.push(`*Order ID:* ${order.order_number}`);
    lines.push(`*Customer:* ${order.shipping_address.name}`);
    lines.push(`*Phone:* ${order.shipping_address.phone}`);
    if (order.shipping_address.email) {
      lines.push(`*Email:* ${order.shipping_address.email}`);
    }
    lines.push('');
    lines.push('*Ordered Products:*');
    order.items.forEach((item: any, idx: number) => {
      lines.push(`${idx + 1}. ${item.product_name} (${item.brand})`);
      lines.push(`   Qty: ${item.quantity} x ৳${item.price} = ৳${item.subtotal.toLocaleString()}`);
    });
    lines.push('');
    lines.push(`*Subtotal:* ৳${order.subtotal.toLocaleString()}`);
    if (order.discount > 0) {
      lines.push(`*Discount:* −৳${order.discount.toLocaleString()}`);
    }
    lines.push(`*Shipping:* ${order.shipping === 0 ? 'Free' : '৳' + order.shipping.toLocaleString()}`);
    lines.push(`*Total:* ৳${order.total.toLocaleString()}`);
    lines.push('');
    lines.push('*Delivery Address:*');
    lines.push(order.shipping_address.address);
    lines.push(`${order.shipping_address.delivery_area}, ${order.shipping_address.district}`);
    lines.push('');
    lines.push(`*Payment Method:* ${paymentLabel(order.payment_method)}`);
    return lines.join('\n');
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleDownloadInvoice = () => {
    if (!order) return;

    const itemsRows = order.items
      .map(
        (item: any, idx: number) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">${idx + 1}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">
            <strong>${item.product_name}</strong><br/>
            <span style="color:#888;font-size:12px;">${item.brand}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">৳${item.price.toLocaleString()}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">৳${item.subtotal.toLocaleString()}</td>
        </tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice - ${order.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; }
  .invoice { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #C4818A, #B06E77); color: #fff; padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-size: 28px; font-weight: 700; }
  .header .invoice-label { font-size: 14px; opacity: 0.85; margin-top: 4px; }
  .order-id { text-align: right; }
  .order-id .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
  .order-id .value { font-size: 18px; font-weight: 600; font-family: monospace; margin-top: 2px; }
  .section { padding: 24px 40px; }
  .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 8px; }
  .info-item p { font-size: 14px; line-height: 1.6; }
  .info-item .name { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { text-align: left; padding: 10px 12px; background: #f9f9f9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #eee; }
  td { font-size: 14px; }
  .totals { margin-top: 16px; margin-left: auto; width: 280px; }
  .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  .totals .row.total { border-top: 2px solid #C4818A; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 700; color: #C4818A; }
  .footer { padding: 20px 40px 32px; text-align: center; }
  .footer p { font-size: 13px; color: #888; }
  .footer .brand { font-weight: 600; color: #C4818A; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; }
  @media print { body { background: #fff; padding: 0; } .invoice { box-shadow: none; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div>
      <h1>Beauty Dokan BD</h1>
      <div class="invoice-label">Premium Beauty &amp; Skincare</div>
    </div>
    <div class="order-id">
      <div class="label">Invoice / Order ID</div>
      <div class="value">${order.order_number}</div>
    </div>
  </div>

  <div class="section">
    <div class="info-grid">
      <div class="info-item">
        <div class="section-title">Billed To</div>
        <p class="name">${order.shipping_address.name}</p>
        <p>${order.shipping_address.phone}</p>
        ${order.shipping_address.email ? `<p>${order.shipping_address.email}</p>` : ''}
      </div>
      <div class="info-item">
        <div class="section-title">Delivery Address</div>
        <p>${order.shipping_address.address}</p>
        <p>${order.shipping_address.delivery_area}, ${order.shipping_address.district}</p>
      </div>
    </div>
    <div class="info-grid" style="margin-top:16px;">
      <div class="info-item">
        <div class="section-title">Order Date</div>
        <p>${new Date(order.created_at).toLocaleString()}</p>
      </div>
      <div class="info-item">
        <div class="section-title">Payment Method</div>
        <p>${paymentLabel(order.payment_method)}</p>
      </div>
    </div>
    <div style="margin-top:12px;">
      <span class="badge">Status: ${order.status}</span>
    </div>
  </div>

  <div class="section" style="padding-top:0;">
    <div class="section-title">Order Items</div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
          <th style="text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>৳${order.subtotal.toLocaleString()}</span></div>
      ${order.discount > 0 ? `<div class="row"><span>Discount</span><span style="color:green;">−৳${order.discount.toLocaleString()}</span></div>` : ''}
      <div class="row"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : '৳' + order.shipping.toLocaleString()}</span></div>
      <div class="row total"><span>Total</span><span>৳${order.total.toLocaleString()}</span></div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for shopping with <span class="brand">Beauty Dokan BD</span></p>
    <p style="margin-top:4px;">Phone: 01712-012737 | WhatsApp: +8801712012737</p>
    <p style="margin-top:8px;font-size:11px;">This is a system-generated invoice.</p>
  </div>
</div>
<script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Thank You */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you{order ? `, ${order.shipping_address.name}` : ''}! Your order has been placed successfully.
        </p>
      </div>

      {/* Order ID card */}
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
                <p className="font-medium">{paymentLabel(order.payment_method)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Total</p>
                <p className="font-semibold text-[#C4818A]">৳{order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp CTA - prominent */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="text-white" size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Confirm Your Order on WhatsApp</h2>
          <p className="text-sm text-gray-600 mt-1">
            Send your order details instantly to our team for faster processing
          </p>
        </div>
        <Button
          onClick={handleWhatsAppOrder}
          className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-semibold rounded-xl"
        >
          <MessageCircle size={20} className="mr-2" />
          Order on WhatsApp
        </Button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold mb-4">Order Timeline</h2>
        <div className="space-y-4">
          {[
            { icon: <CheckCircle2 className="text-green-600" size={16} />, bg: 'bg-green-100', label: 'Order Placed', sub: order ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString(), active: true },
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
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                </div>
                <p className="font-medium text-sm">৳{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : `৳${order.shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-bold pt-1.5 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#C4818A]">৳{order.total.toLocaleString()}</span>
            </div>
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
              {order.shipping_address.email && (
                <p className="text-sm text-gray-500">{order.shipping_address.email}</p>
              )}
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
              {order ? paymentLabel(order.payment_method) : 'Cash on Delivery'}
            </p>
            <p className="text-sm text-gray-500">
              {order?.payment_method === 'cod'
                ? 'Pay with cash when your order arrives'
                : 'Payment will be confirmed by our team'}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-[#C4818A] hover:bg-[#B06E77]">
            <Link href="/shop">
              <ShoppingBag size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadInvoice}
            className="flex-1"
          >
            <Download size={16} className="mr-2" />
            Download Invoice
          </Button>
        </div>
        <Button variant="ghost" asChild className="w-full">
          <Link href="/">
            <ArrowRight size={16} className="mr-1" />
            Back to Home
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
