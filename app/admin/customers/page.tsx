'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, ShoppingBag, Search } from 'lucide-react';
import { DEMO_CUSTOMER_STATS, DEMO_ORDERS, DEMO_USER } from '@/lib/demo-data';
import AdminLayout from '../AdminShell';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const CUSTOMERS_STORAGE_KEY = 'beautydokanbd_customers';

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    full_name: DEMO_USER.full_name,
    phone: DEMO_USER.phone,
    created_at: DEMO_USER.created_at,
    order_count: DEMO_ORDERS.length,
    total_spent: DEMO_ORDERS.reduce((sum, o) => sum + o.total, 0)
  },
  {
    id: 'user-002',
    email: 'fatima@example.com',
    full_name: 'Fatima Rahman',
    phone: '+880 1812345678',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    order_count: 3,
    total_spent: 4500
  },
  {
    id: 'user-003',
    email: 'rahim@example.com',
    full_name: 'Rahim Ahmed',
    phone: '+880 1912345678',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    order_count: 5,
    total_spent: 8900
  },
  {
    id: 'user-004',
    email: 'sarah@example.com',
    full_name: 'Sarah Khan',
    phone: '+880 1612345678',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    order_count: 2,
    total_spent: 2200
  },
  {
    id: 'user-005',
    email: 'nadim@example.com',
    full_name: 'Nadim Hassan',
    phone: '+880 1512345678',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    order_count: 7,
    total_spent: 12300
  }
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(DEMO_CUSTOMERS));
    }
    setLoading(false);
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout activeTab="customers">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500">{customers.length} customers</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[#C4818A] border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No customers found</div>
          ) : (
            filteredCustomers.map(customer => (
              <Sheet key={customer.id}>
                <SheetTrigger asChild>
                  <div
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-shadow cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#C4818A] flex items-center justify-center text-white font-semibold text-lg shrink-0">
                        {(customer.full_name || customer.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{customer.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500">
                          Joined {new Date(customer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="shrink-0" />
                          <span className="truncate">{customer.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ShoppingBag size={14} />
                        <span>{customer.order_count} orders</span>
                      </div>
                      <p className="font-semibold text-[#C4818A]">৳{customer.total_spent.toLocaleString()}</p>
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Customer Details</SheetTitle>
                    <SheetDescription>
                      Full profile and order history for this customer.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#C4818A] flex items-center justify-center text-white font-bold text-2xl shrink-0">
                        {(customer.full_name || customer.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{customer.full_name || 'Anonymous User'}</h2>
                        <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail size={16} className="text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone size={16} className="text-gray-400" />
                        <span>{customer.phone || 'No phone number provided'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-rose-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-[#1C1C2E]">{customer.order_count}</p>
                      </div>
                      <div className="bg-rose-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                        <p className="text-2xl font-bold text-[#C4818A]">৳{customer.total_spent.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Recent Activity</h3>
                      <p className="text-sm text-gray-500 italic">No recent activity to display for this mock user.</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
