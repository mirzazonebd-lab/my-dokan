'use client';

import { useEffect, useState } from 'react';
import { Truck, MapPinned, ShieldCheck } from 'lucide-react';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { readLocalStorage, writeLocalStorage } from '@/lib/admin-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const STORAGE_KEY = 'beautydokanbd_admin_settings';

const defaultSettings = {
  storeName: 'Beauty Dokan BD',
  storeEmail: 'info@beautydokan.com',
  storePhone: '+8809638758429',
  freeShippingThreshold: 2026,
  deliveryCharge: 60,
  insideDhakaShipping: 60,
  outsideDhakaShipping: 120,
  codEnabled: true,
  emailNotifications: true,
  orderConfirmationSMS: true,
};

export default function AdminShippingPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .in('setting_key', ['inside_dhaka_shipping_fee', 'outside_dhaka_shipping_fee', 'free_shipping_threshold']);

        if (!error && data?.length) {
          const map = Object.fromEntries(data.map((item: { setting_key: any; setting_value: any; }) => [item.setting_key, item.setting_value]));
          const next = {
            ...defaultSettings,
            insideDhakaShipping: Number(map.inside_dhaka_shipping_fee?.shipping_fee ?? defaultSettings.insideDhakaShipping),
            outsideDhakaShipping: Number(map.outside_dhaka_shipping_fee?.shipping_fee ?? defaultSettings.outsideDhakaShipping),
            freeShippingThreshold: Number(map.free_shipping_threshold?.threshold ?? defaultSettings.freeShippingThreshold),
            deliveryCharge: Number(map.inside_dhaka_shipping_fee?.shipping_fee ?? defaultSettings.insideDhakaShipping),
          };
          setSettings(next);
          writeLocalStorage(STORAGE_KEY, next);
          return;
        }
      }

      const existing = readLocalStorage<typeof defaultSettings>(STORAGE_KEY, defaultSettings);
      setSettings({
        ...defaultSettings,
        ...existing,
        insideDhakaShipping: existing.insideDhakaShipping ?? existing.deliveryCharge ?? 60,
        outsideDhakaShipping: existing.outsideDhakaShipping ?? (existing.deliveryCharge ? existing.deliveryCharge * 2 : 120),
      });
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    const normalized = {
      ...settings,
      deliveryCharge: settings.insideDhakaShipping,
      freeShippingThreshold: Number(settings.freeShippingThreshold || 0),
    };
    setSettings(normalized);
    writeLocalStorage(STORAGE_KEY, normalized);

    if (isSupabaseConfigured) {
      await supabase.from('settings').upsert({
        setting_key: 'inside_dhaka_shipping_fee',
        setting_value: { zone: 'Inside Dhaka', shipping_fee: Number(settings.insideDhakaShipping || 0), is_active: true },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'setting_key' });

      await supabase.from('settings').upsert({
        setting_key: 'outside_dhaka_shipping_fee',
        setting_value: { zone: 'Outside Dhaka', shipping_fee: Number(settings.outsideDhakaShipping || 0), is_active: true },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'setting_key' });

      await supabase.from('settings').upsert({
        setting_key: 'free_shipping_threshold',
        setting_value: { threshold: Number(settings.freeShippingThreshold || 0), is_active: true },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'setting_key' });
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout activeTab="shipping">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
            <p className="text-gray-500">Configure delivery charges for Dhaka and outside Dhaka</p>
          </div>
          {saved && <div className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">Saved</div>}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPinned size={18} className="text-[#C4818A]" />
              <h2 className="font-semibold text-gray-900">Delivery zones</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inside Dhaka</label>
                <Input
                  type="number"
                  value={settings.insideDhakaShipping}
                  onChange={(e) => setSettings({ ...settings, insideDhakaShipping: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outside Dhaka</label>
                <Input
                  type="number"
                  value={settings.outsideDhakaShipping}
                  onChange={(e) => setSettings({ ...settings, outsideDhakaShipping: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Free shipping threshold</label>
                <Input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-[#C4818A]" />
              <h2 className="font-semibold text-gray-900">Operational notes</h2>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="rounded-lg bg-rose-50 p-3">
                <div className="flex items-center gap-2 text-gray-900 font-medium"><Truck size={16} /> Regional delivery</div>
                <p className="mt-2">Current logic supports a configurable Dhaka and non-Dhaka shipping rate without hard-coding the values in the storefront. This is ready for future courier integrations.</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <p>Future-ready lane: Pathao, Steadfast, RedX, Paperfly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-[#C4818A] hover:bg-[#B06E77]" onClick={handleSave}>Save shipping settings</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
