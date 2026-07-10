'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart/CartStore';

interface FloatingCartProps {
  onClick: () => void;
}

export default function FloatingCart({ onClick }: FloatingCartProps) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 left-4 z-40 w-14 h-14 bg-[#C4818A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#B06E77] transition-all hover:scale-110 group"
      aria-label={`View cart with ${itemCount} items`}
    >
      <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#1C1C2E] text-white text-xs font-bold rounded-full flex items-center justify-center">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    </button>
  );
}
