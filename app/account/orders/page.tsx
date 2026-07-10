'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Eye, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Order, OrderItem, getDemoOrderItems, DEMO_ORDERS } from '@/lib/demo-data';
import AccountLayout from '../AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const ORDERS_STORAGE_KEY = 'beautydokanbd_orders';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (storedOrders) {
      const parsed = JSON.parse(storedOrders);
      const userOrders = parsed.filter((o: any) => o.user_id === user.id);
      setOrders(userOrders);
    } else {
      // Use demo orders
      const demoOrdersWithItems = DEMO_ORDERS.map(order => ({
        ...order,
        items: getDemoOrderItems(order.id)
      }));
      setOrders(demoOrdersWithItems);
    }
    setLoading(false);
  }, [user]);

  return (
    <ClientWrapper>
      <AccountLayout activeTab="orders">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Package size={24} className="text-[#C4818A]" />
          Order History
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#C4818A] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">When you place an order, it will appear here.</p>
            <Button asChild className="bg-[#C4818A] hover:bg-[#B06E77]">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-rose-200 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono font-semibold">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-semibold text-[#C4818A]">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {order.items.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                    >
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-sm font-medium text-gray-600">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span className="capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      <Eye size={14} className="mr-1" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
