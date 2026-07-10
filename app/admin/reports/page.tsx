'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { DEMO_ANALYTICS } from '@/lib/demo-data';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';

export default function AdminReportsPage() {
  const [reportData] = useState({
    daily: { orders: DEMO_ANALYTICS.today.orders, revenue: DEMO_ANALYTICS.today.revenue },
    weekly: { orders: DEMO_ANALYTICS.thisWeek.orders, revenue: DEMO_ANALYTICS.thisWeek.revenue },
    monthly: { orders: DEMO_ANALYTICS.thisMonth.orders, revenue: DEMO_ANALYTICS.thisMonth.revenue },
    yearly: { orders: DEMO_ANALYTICS.thisYear.orders, revenue: DEMO_ANALYTICS.thisYear.revenue },
  });

  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500">Sales and performance reports</p>
          </div>
          <Button variant="outline">
            <Download size={16} className="mr-1" />
            Export All
          </Button>
        </div>

        {/* Time Period Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} />
              <span className="text-sm font-medium">Today</span>
            </div>
            <p className="text-3xl font-bold">{reportData.daily.orders}</p>
            <p className="text-sm text-blue-100">orders</p>
            <p className="text-xl font-semibold mt-3">৳{reportData.daily.revenue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} />
              <span className="text-sm font-medium">This Week</span>
            </div>
            <p className="text-3xl font-bold">{reportData.weekly.orders}</p>
            <p className="text-sm text-purple-100">orders</p>
            <p className="text-xl font-semibold mt-3">৳{reportData.weekly.revenue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-[#C4818A] to-[#B06E77] rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <p className="text-3xl font-bold">{reportData.monthly.orders}</p>
            <p className="text-sm text-rose-100">orders</p>
            <p className="text-xl font-semibold mt-3">৳{reportData.monthly.revenue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} />
              <span className="text-sm font-medium">This Year</span>
            </div>
            <p className="text-3xl font-bold">{reportData.yearly.orders}</p>
            <p className="text-sm text-green-100">orders</p>
            <p className="text-xl font-semibold mt-3">৳{reportData.yearly.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold">Available Reports</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Sales Report', desc: 'Daily, weekly, and monthly sales breakdown', icon: <DollarSign /> },
              { name: 'Order Report', desc: 'Order status and fulfillment metrics', icon: <Package /> },
              { name: 'Customer Report', desc: 'Customer acquisition and retention', icon: <Users /> },
              { name: 'Product Performance', desc: 'Top selling and low inventory products', icon: <TrendingUp /> },
              { name: 'Inventory Report', desc: 'Stock levels and reorder alerts', icon: <Package /> },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    {report.icon}
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="outline" size="sm">
                    <Download size={14} className="mr-1" />
                    CSV
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold mb-4">Top Categories by Revenue</h3>
            <div className="space-y-3">
              {[
                { name: 'Korean Skincare', value: 185000, percent: 35 },
                { name: 'Makeup', value: 120000, percent: 25 },
                { name: 'Skincare', value: 90000, percent: 18 },
                { name: 'Hair Care', value: 60000, percent: 12 },
                { name: 'Body Care', value: 45000, percent: 10 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32">{item.name}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4818A] rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">৳{(item.value / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {[
                { name: 'Cash on Delivery', value: 65, color: 'bg-green-500' },
                { name: 'bKash', value: 20, color: 'bg-pink-500' },
                { name: 'Nagad', value: 15, color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
