'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { CartProvider } from '@/components/cart/CartStore';
import { CompareProvider } from '@/components/CompareDrawer';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          {children}
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  );
}
