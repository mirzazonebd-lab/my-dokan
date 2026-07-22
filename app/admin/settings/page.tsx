'use client';

import { useState, useEffect } from 'react';
import { Settings, Store, Bell, CreditCard, Truck, Mail, Shield, Globe, Check } from 'lucide-react';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const SETTINGS_STORAGE_KEY = 'beautydokanbd_admin_settings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'Beauty Dokan BD',
    storeEmail: 'info@beautydokan.com',
    storePhone: '+8801712012737',
    freeShippingThreshold: 1500,
    deliveryCharge: 60,
    codEnabled: true,
    bkashEnabled: true,
    nagadEnabled: true,
    emailNotifications: true,
    orderConfirmationSMS: true,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings(parsed);
      } catch {
        // Use defaults if parse fails
      }
    }
    setLoading(false);
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save to localStorage
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    
    setSaved(true);
    setLoading(false);

    // Hide success message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <AdminLayout activeTab="settings">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-[#C4818A] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          {saved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <Check size={16} />
              <span className="text-sm font-medium">Settings saved successfully</span>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {/* Store Settings */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Store size={18} className="text-gray-600" />
              <h3 className="font-semibold">Store Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <Input
                    value={settings.storeName}
                    onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <Input
                    type="email"
                    value={settings.storeEmail}
                    onChange={e => setSettings({ ...settings, storeEmail: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <Input
                  value={settings.storePhone}
                  onChange={e => setSettings({ ...settings, storePhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Truck size={18} className="text-gray-600" />
              <h3 className="font-semibold">Shipping</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (BDT)</label>
                  <Input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge (BDT)</label>
                  <Input
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={e => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">Free shipping applies to orders above the threshold.</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-600" />
              <h3 className="font-semibold">Payment Methods</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <Truck size={16} className="text-green-600" />
                  </div>
                  <span>Cash on Delivery</span>
                </div>
                <Switch
                  checked={settings.codEnabled}
                  onCheckedChange={checked => setSettings({ ...settings, codEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                    <span className="text-pink-600 text-xs font-bold">bK</span>
                  </div>
                  <span>bKash</span>
                </div>
                <Switch
                  checked={settings.bkashEnabled}
                  onCheckedChange={checked => setSettings({ ...settings, bkashEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-bold">N</span>
                  </div>
                  <span>Nagad</span>
                </div>
                <Switch
                  checked={settings.nagadEnabled}
                  onCheckedChange={checked => setSettings({ ...settings, nagadEnabled: checked })}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Bell size={18} className="text-gray-600" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive emails for new orders</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={checked => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Confirmation SMS</p>
                  <p className="text-sm text-gray-500">Send SMS confirmation to customers</p>
                </div>
                <Switch
                  checked={settings.orderConfirmationSMS}
                  onCheckedChange={checked => setSettings({ ...settings, orderConfirmationSMS: checked })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-[#C4818A] hover:bg-[#B06E77]"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
