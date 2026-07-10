'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown, ArrowRight, Clock, Truck, CircleCheck as CheckCircle, Circle as XCircle, Eye } from 'lucide-react';
import { DEMO_ORDERS, DEMO_DASHBOARD_STATS, DEMO_CUSTOMER_STATS } from '@/lib/demo-data';
import AdminLayout from './AdminShell';
import { products } from '@/lib/data/products';

function BarChart({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20 truncate">{item.name}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C4818A] to-champagne-400 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendValue, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <p className={`text-xs flex items-center gap-1 mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trendValue}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEMO_DASHBOARD_STATS);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Use demo data for stats
    setStats(DEMO_DASHBOARD_STATS);

    // Get recent orders from demo data
    const recent = DEMO_ORDERS.slice(0, 5);
    setRecentOrders(recent);
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const salesData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 8 },
    { name: 'Thu', value: 15 },
    { name: 'Fri', value: 22 },
    { name: 'Sat', value: 28 },
    { name: 'Sun', value: 18 },
  ];

  const categoryData = [
    { name: 'K-Beauty', value: 45 },
    { name: 'Makeup', value: 32 },
    { name: 'Skincare', value: 28 },
    { name: 'Hair', value: 15 },
    { name: 'Body', value: 12 },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<Package className="text-white" size={24} />}
            color="bg-blue-500"
            trend="up"
            trendValue="+12% from last month"
          />
          <StatCard
            title="Total Revenue"
            value={`৳${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="text-white" size={24} />}
            color="bg-green-500"
            trend="up"
            trendValue="+8% from last month"
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon={<ShoppingBag className="text-white" size={24} />}
            color="bg-[#C4818A]"
          />
          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            icon={<Users className="text-white" size={24} />}
            color="bg-purple-500"
            trend="up"
            trendValue="+5 new today"
          />
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Package size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{stats.processingOrders}</p>
                <p className="text-xs text-purple-600">Processing</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Truck size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-700">{stats.shippedOrders}</p>
                <p className="text-xs text-indigo-600">Shipped</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.deliveredOrders}</p>
                <p className="text-xs text-green-600">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BarChart data={salesData} title="Weekly Sales" />
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C4818A] rounded-full"
                        style={{ width: `${(item.value / 45) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-[#C4818A] hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Order</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Total</th>
                    <th className="text-center py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{order.order_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.shipping_address?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-right">
                        ৳{Number(order.total).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
