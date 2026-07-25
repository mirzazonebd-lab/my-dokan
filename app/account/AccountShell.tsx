'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Package, Heart, Clock, MapPin, Bell, Settings, LogOut, ChevronRight, Moon, Sun
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: <User size={20} />, href: '/account' },
  { id: 'orders', label: 'Order History', icon: <Package size={20} />, href: '/account/orders' },
  { id: 'addresses', label: 'Address Book', icon: <MapPin size={20} />, href: '/account/addresses' },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} />, href: '/account/wishlist' },
  { id: 'recent', label: 'Recently Viewed', icon: <Clock size={20} />, href: '/account/recent' },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, href: '/account/notifications' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, href: '/account/settings' },
];

export default function AccountLayout({
  children,
  activeTab
}: {
  children: React.ReactNode;
  activeTab: string;
}) {
  const router = useRouter();
  const { user, profile, signOut, loading: authLoading, updateProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/account');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  useEffect(() => {
    if (profile?.dark_mode !== undefined) {
      setDarkMode(profile.dark_mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.dark_mode]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);

    // Update profile via auth context
    if (user) {
      await updateProfile({ dark_mode: newValue });
    }

    // Apply dark mode class
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#C4818A] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* User info */}
              <div className="p-6 bg-gradient-to-br from-[#C4818A]/10 to-champagne-100/10 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#C4818A] flex items-center justify-center text-white font-semibold text-lg">
                    {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{profile?.full_name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {navItems.map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#C4818A] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={16} />}
                  </Link>
                ))}

                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="flex-1">Dark Mode</span>
                  <div className={`w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#C4818A]' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-1 ${darkMode ? 'translate-x-5 ml-0.5' : 'translate-x-1'}`} />
                  </div>
                </button>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
