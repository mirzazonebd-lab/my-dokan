'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, ChartBar as BarChart3 } from 'lucide-react';
import { DEMO_ANALYTICS, DEMO_ORDERS } from '@/lib/demo-data';
import AdminLayout from '../AdminShell';
import { products } from '@/lib/data/products';

function StatCard({ label, value, change, icon }: { label: string; value: string; change?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#C4818A]/10 flex items-center justify-center">{icon}</div>
      </div>
    </div>
  );
}

function SimpleBarChart({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full bg-gradient-to-t from-[#C4818A] to-champagne-400 rounded-t-lg transition-all duration-500"
            style={{ height: `${(item.value / max) * 100}%`, minHeight: item.value > 0 ? 4 : 0 }}
          />
          <span className="text-[10px] text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: '2.4%',
  });
  const [salesByMonth, setSalesByMonth] = useState<{ label: string; value: number }[]>([]);
  const [topProducts, setTopProducts] = useState<typeof products>([]);

  useEffect(() => {
    // Calculate stats from demo data
    const totalRevenue = DEMO_ORDERS.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = DEMO_ORDERS.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    setStats({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      conversionRate: '2.4%',
    });

    // Monthly sales data
    setSalesByMonth([
      { label: 'Jan', value: 15000 },
      { label: 'Feb', value: 22000 },
      { label: 'Mar', value: 18000 },
      { label: 'Apr', value: 25000 },
      { label: 'May', value: 30000 },
      { label: 'Jun', value: 28000 },
      { label: 'Jul', value: 35000 },
    ]);

    // Top products by rating
    const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
    setTopProducts(topRated);
  }, []);

  return (
    <AdminLayout activeTab="analytics">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={`৳${stats.totalRevenue.toLocaleString()}`}
            change="+12% vs last month"
            icon={<DollarSign className="text-[#C4818A]" size={20} />}
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders.toString()}
            change="+8% vs last month"
            icon={<ShoppingCart className="text-[#C4818A]" size={20} />}
          />
          <StatCard
            label="Avg Order Value"
            value={`৳${stats.avgOrderValue.toLocaleString()}`}
            icon={<TrendingUp className="text-[#C4818A]" size={20} />}
          />
          <StatCard
            label="Conversion Rate"
            value={stats.conversionRate}
            change="+0.3% from last week"
            icon={<Users className="text-[#C4818A]" size={20} />}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold mb-4">Monthly Revenue</h3>
            <SimpleBarChart data={salesByMonth} />
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {[
                { source: 'Direct', value: 45 },
                { source: 'Google Search', value: 28 },
                { source: 'Facebook', value: 15 },
                { source: 'Instagram', value: 8 },
                { source: 'Referral', value: 4 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-28">{item.source}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C4818A] to-champagne-400 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold mb-4">Top Rated Products</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topProducts.map(product => (
              <div key={product.id} className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                <p className="text-xs text-[#C4818A]">{product.rating} ★</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
