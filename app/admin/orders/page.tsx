'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ChevronDown, Filter, Search, CircleCheck as CheckCircle, Clock, Package, Truck, Circle as XCircle, Download, Printer } from 'lucide-react';
import { DEMO_ORDERS, getDemoOrderItems, Order, OrderItem } from '@/lib/demo-data';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const ORDERS_STORAGE_KEY = 'beautydokanbd_admin_orders';
const CHECKOUT_ORDERS_KEY = 'beautydokanbd_orders';
const paymentStatusOptions = ['Pending Verification', 'Verified', 'Rejected'] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Load from localStorage or use demo data
    const storedOrders = localStorage.getItem(CHECKOUT_ORDERS_KEY) || localStorage.getItem(ORDERS_STORAGE_KEY);
    if (storedOrders) {
      const parsed = JSON.parse(storedOrders);
      setOrders(parsed);
    } else {
      // Use demo orders with generated items
      const ordersWithItems = DEMO_ORDERS.map(order => ({
        ...order,
        items: getDemoOrderItems(order.id)
      }));
      setOrders(ordersWithItems);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersWithItems));
      localStorage.setItem(CHECKOUT_ORDERS_KEY, JSON.stringify(ordersWithItems));
    }
    setLoading(false);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    localStorage.setItem(CHECKOUT_ORDERS_KEY, JSON.stringify(updatedOrders));
    setSelectedOrder(prev => prev ? { ...prev, status } : null);
  };

  const updatePaymentStatus = (orderId: string, payment_status: typeof paymentStatusOptions[number]) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, payment_status } : o);
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    localStorage.setItem(CHECKOUT_ORDERS_KEY, JSON.stringify(updatedOrders));
    setSelectedOrder(prev => prev ? { ...prev, payment_status } : null);
  };

  const downloadOrderDetails = (order: OrderWithItems) => {
    const content = `
═══════════════════════════════════════════
          BEAUTY DOKAN BD - ORDER DETAILS
═══════════════════════════════════════════

ORDER NUMBER: ${order.order_number}
ORDER DATE: ${new Date(order.created_at).toLocaleDateString()}
ORDER STATUS: ${order.status.toUpperCase()}

───────────────────────────────────────────
CUSTOMER INFORMATION
───────────────────────────────────────────
Name: ${order.shipping_address?.name || 'N/A'}
Phone: ${order.shipping_address?.phone || 'N/A'}
Email: ${order.shipping_address?.email || 'N/A'}
Address: ${order.shipping_address?.address || 'N/A'}
City: ${order.shipping_address?.city || 'N/A'}
District: ${order.shipping_address?.district || 'N/A'}
Postal Code: ${order.shipping_address?.postal_code || 'N/A'}

───────────────────────────────────────────
PAYMENT INFORMATION
───────────────────────────────────────────
Payment Method: ${order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
Payment Status: ${order.payment_status}
Transaction ID: ${order.transaction_id || 'N/A'}

───────────────────────────────────────────
ORDER ITEMS
───────────────────────────────────────────
${order.items.map(item => `
Product: ${item.product_name}
Brand: ${item.brand}
Quantity: ${item.quantity}
Price: ৳${item.price.toLocaleString()}
Subtotal: ৳${item.subtotal.toLocaleString()}
`).join('\n')}

───────────────────────────────────────────
ORDER SUMMARY
───────────────────────────────────────────
Subtotal: ৳${order.subtotal.toLocaleString()}
${order.discount > 0 ? `Discount: -৳${order.discount.toLocaleString()}\n` : ''}Shipping: ${order.shipping === 0 ? 'FREE' : `৳${order.shipping.toLocaleString()}`}
───────────────────────────────────────────
TOTAL: ৳${order.total.toLocaleString()}
═══════════════════════════════════════════

Downloaded on: ${new Date().toLocaleString()}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `order-${order.order_number}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printOrderDetails = (order: OrderWithItems) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const content = `
<!DOCTYPE html>
<html>
<head>
    <title>Order ${order.order_number}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #C4818A; padding-bottom: 10px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 14px; background: #f0f0f0; padding: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f0f0f0; }
        .total { font-weight: bold; font-size: 16px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BEAUTY DOKAN BD</h1>
        <p>Order Details</p>
    </div>

    <div class="section">
        <div class="section-title">Order Information</div>
        <div class="summary-row">
            <span>Order Number:</span>
            <strong>${order.order_number}</strong>
        </div>
        <div class="summary-row">
            <span>Order Date:</span>
            <strong>${new Date(order.created_at).toLocaleDateString()}</strong>
        </div>
        <div class="summary-row">
            <span>Status:</span>
            <strong>${order.status.toUpperCase()}</strong>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="summary-row">
            <span>Name:</span>
            <strong>${order.shipping_address?.name || 'N/A'}</strong>
        </div>
        <div class="summary-row">
            <span>Phone:</span>
            <strong>${order.shipping_address?.phone || 'N/A'}</strong>
        </div>
        <div class="summary-row">
            <span>Email:</span>
            <strong>${order.shipping_address?.email || 'N/A'}</strong>
        </div>
        <div class="summary-row">
            <span>Address:</span>
            <strong>${order.shipping_address?.address || 'N/A'}</strong>
        </div>
        <div class="summary-row">
            <span>City/District:</span>
            <strong>${order.shipping_address?.city || 'N/A'}, ${order.shipping_address?.district || 'N/A'}</strong>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Order Items</div>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>${item.brand}</td>
                        <td>${item.quantity}</td>
                        <td>৳${item.price.toLocaleString()}</td>
                        <td>৳${item.subtotal.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Payment Information</div>
        <div class="summary-row">
            <span>Payment Method:</span>
            <strong>${order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</strong>
        </div>
        <div class="summary-row">
            <span>Payment Status:</span>
            <strong>${order.payment_status}</strong>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Order Summary</div>
        <div class="summary-row">
            <span>Subtotal:</span>
            <strong>৳${order.subtotal.toLocaleString()}</strong>
        </div>
        ${order.discount > 0 ? `
        <div class="summary-row">
            <span>Discount:</span>
            <strong>-৳${order.discount.toLocaleString()}</strong>
        </div>
        ` : ''}
        <div class="summary-row">
            <span>Shipping:</span>
            <strong>${order.shipping === 0 ? 'FREE' : `৳${order.shipping.toLocaleString()}`}</strong>
        </div>
        <div class="summary-row total">
            <span>TOTAL:</span>
            <span>৳${order.total.toLocaleString()}</span>
        </div>
    </div>

    <div class="footer">
        <p>Printed on: ${new Date().toLocaleString()}</p>
        <p>This is an automated order summary. Please retain for your records.</p>
    </div>

    <script>
        window.print();
        window.close();
    </script>
</body>
</html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const viewOrder = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500">Manage customer orders</p>
          </div>
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by order number or customer..."
              className="pl-10"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="h-10 px-4 pr-10 rounded-lg border border-gray-200 appearance-none"
            >
              <option value="all">All Status</option>
              {statusOptions.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#C4818A] border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Items</th>
                    <th className="text-left py-3 px-4 font-medium">Payment</th>
                    <th className="text-left py-3 px-4 font-medium">Verification</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Total</th>
                    <th className="text-center py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm font-medium">{order.order_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium">{order.shipping_address?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.shipping_address?.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-gray-600">{order.payment_status}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-right">
                        ৳{Number(order.total).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewOrder(order)}
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No orders found</div>
          )}
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
            <div className="flex gap-2">
              {selectedOrder && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => selectedOrder && downloadOrderDetails(selectedOrder)}
                    className="gap-2"
                  >
                    <Download size={16} />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => selectedOrder && printOrderDetails(selectedOrder)}
                    className="gap-2"
                  >
                    <Printer size={16} />
                    Print
                  </Button>
                </>
              )}
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Status Update */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Update Status:</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                  className="h-9 px-3 rounded-lg border border-gray-200"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase mb-2">Shipping Address</p>
                  <p className="font-medium">{selectedOrder.shipping_address?.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shipping_address?.phone}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.shipping_address?.address}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.district}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase mb-2">Payment</p>
                  <p className="font-medium capitalize">{selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : selectedOrder.payment_method}</p>
                  <p className="text-sm text-gray-500">Transaction ID: {selectedOrder.transaction_id || 'Not provided'}</p>
                  <label className="mt-3 block text-xs font-medium text-gray-500">Payment Status</label>
                  <select value={selectedOrder.payment_status} onChange={e => updatePaymentStatus(selectedOrder.id, e.target.value as typeof paymentStatusOptions[number])} className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-2 text-sm">
                    {paymentStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                  {selectedOrder.payment_screenshot && <a href={selectedOrder.payment_screenshot} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-[#C4818A] hover:underline">View payment screenshot</a>}
                  <p className="text-2xl font-bold mt-2">৳{selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-xs text-gray-400 uppercase mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#C4818A]">{item.brand}</p>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                      </div>
                      <p className="font-medium">৳{item.subtotal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-৳{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE' : `৳${selectedOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
