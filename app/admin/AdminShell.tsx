'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Layers, Tag, Warehouse, Ticket, Users, ChartBar as BarChart3, FileText, Settings, LogOut, ChevronDown, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { DEMO_ORDERS } from '@/lib/demo-data';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
  { id: 'orders', label: 'Orders', icon: <Package size={20} />, href: '/admin/orders', badge: 5 },
  { id: 'products', label: 'Products', icon: <ShoppingBag size={20} />, href: '/admin/products' },
  { id: 'categories', label: 'Categories', icon: <Layers size={20} />, href: '/admin/categories' },
  { id: 'brands', label: 'Brands', icon: <Tag size={20} />, href: '/admin/brands' },
  { id: 'inventory', label: 'Inventory', icon: <Warehouse size={20} />, href: '/admin/inventory' },
  { id: 'coupons', label: 'Coupons', icon: <Ticket size={20} />, href: '/admin/coupons' },
  { id: 'customers', label: 'Customers', icon: <Users size={20} />, href: '/admin/customers' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, href: '/admin/analytics' },
  { id: 'reports', label: 'Reports', icon: <FileText size={20} />, href: '/admin/reports' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
];

export default function AdminLayout({
  children,
  activeTab
}: {
  children: React.ReactNode;
  activeTab: string;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // Count pending orders from demo data
    const pending = DEMO_ORDERS.filter(o => o.status === 'pending').length;
    setPendingOrders(pending);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-bold text-lg">Admin Panel</span>
        <button className="relative">
          <Bell size={20} />
          {pendingOrders > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {pendingOrders}
            </span>
          )}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen bg-[#1C1C2E] text-white z-40 transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            {sidebarOpen && (
              <span className="font-bold text-xl">
                <span className="text-[#C4818A]">Skin</span>Verse Admin
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-white/10 rounded-lg"
            >
              <ChevronDown size={16} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
            {navItems.map(item => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#C4818A] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors mt-4 border-t border-white/10 pt-4"
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0 pt-16 lg:pt-0">
          {/* Top Bar */}
          <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-6 sticky top-0 z-30">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
                {pendingOrders > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C4818A] flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </header>

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
