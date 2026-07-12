'use client';

import Link from 'next/link';
import { Lock, Mail, Zap } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1C1C2E] via-[#33334C] to-[#1F2D4D] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-8 py-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#C4818A] flex items-center justify-center text-white shadow-lg">
              <Lock size={28} />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-2">Secure access for store managers and administrators.</p>
          </div>

          <form className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <div className="mt-2 relative rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-[#C4818A] focus-within:ring-1 focus-within:ring-[#C4818A]">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-transparent outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <div className="mt-2 relative rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-[#C4818A] focus-within:ring-1 focus-within:ring-[#C4818A]">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-transparent outline-none"
                />
              </div>
            </label>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C4818A] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C4818A]/20 hover:bg-[#b06e77] transition"
            >
              <Zap size={16} />
              Sign in
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Access the admin dashboard for managing products, orders, customers and store settings.
            </p>
            <p className="mt-4">
              <Link href="/admin" className="font-semibold text-[#C4818A] hover:text-[#b06e77]">
                Continue to dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
