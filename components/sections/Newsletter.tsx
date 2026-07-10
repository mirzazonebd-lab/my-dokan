'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-[#1C1C2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-white/60 mb-8">
            Subscribe for exclusive deals, new arrivals, and beauty tips
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4818A]/50"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#C4818A] hover:bg-[#B06E77] text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                Subscribe
                <ArrowRight size={15} />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
              <CheckCircle2 size={20} className="text-green-400" />
              <span className="text-white font-medium">Thanks for subscribing! Check your inbox.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
