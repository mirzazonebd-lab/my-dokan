'use client';

import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/sonner';

export default function ClientBody({ children }: { children: ReactNode }) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  );
}
