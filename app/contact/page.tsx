'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Send, MessageCircle, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_INFO } from '@/lib/config/site-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in your name, email, and message.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast({ title: 'Message sent! We will get back to you within 24-48 hours.' });
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactCards = [
    {
      icon: <Phone size={22} />,
      title: 'Call Us',
      lines: [SITE_INFO.phone, SITE_INFO.phone2],
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Mail size={22} />,
      title: 'Email Us',
      lines: [SITE_INFO.email],
      color: 'bg-rose-50 text-rose-600',
    },
    {
      icon: <MessageCircle size={22} />,
      title: 'WhatsApp',
      lines: [SITE_INFO.social.whatsapp],
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: <MapPin size={22} />,
      title: 'Visit Us',
      lines: [SITE_INFO.location],
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1C1C2E] via-[#2D1B2E] to-[#1C1C2E] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C4818A]/20 border border-[#C4818A]/30 mb-5">
            <MessageCircle size={26} className="text-[#E8A0AA]" />
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question about an order, product, or return? We are here to help.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
              <div className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              {card.lines.map((line, i) => (
                <p key={i} className="text-sm text-gray-500">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Form + Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="font-poppins text-xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-sm text-gray-500 mb-6">We typically respond within 24-48 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What is this about?"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  rows={5}
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-[#C4818A] hover:bg-[#B06E77]">
                {submitting ? 'Sending...' : 'Send Message'}
                <Send size={16} className="ml-2" />
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1C1C2E] to-[#2D1B2E] rounded-2xl p-6 sm:p-8 text-white">
              <h2 className="font-poppins text-xl font-bold mb-4">Business Hours</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={18} className="text-[#E8A0AA]" />
                  <span>Saturday - Thursday: 9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={18} className="text-[#E8A0AA]" />
                  <span>Friday: Closed</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-semibold text-white mb-3">Connect With Us</h3>
                <div className="flex gap-3">
                  <a href={SITE_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#C4818A] rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href={SITE_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#C4818A] rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href={SITE_INFO.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#C4818A] rounded-lg flex items-center justify-center transition-colors" aria-label="YouTube">
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blush-50 rounded-2xl p-6 sm:p-8 border border-blush-100">
              <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">Quick Links</h3>
              <p className="text-sm text-gray-600 mb-4">You might find what you need faster here:</p>
              <div className="flex flex-wrap gap-3">
                <a href="/legal/shipping-policy" className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#C4818A] hover:text-[#C4818A] transition-colors">Shipping Policy</a>
                <a href="/legal/return-refund-policy" className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#C4818A] hover:text-[#C4818A] transition-colors">Return &amp; Refund</a>
                <a href="/account/orders" className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#C4818A] hover:text-[#C4818A] transition-colors">Track Order</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
