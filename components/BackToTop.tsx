'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-4 z-40 w-10 h-10 bg-[#1C1C2E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#C4818A] transition-colors"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
