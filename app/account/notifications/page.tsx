'use client';

import { Bell, Info, Package, Tag } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import AccountLayout from '../AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Switch } from '@/components/ui/switch';

export default function NotificationsPage() {
  const { profile, updateProfile } = useAuth();

  const updatePreferences = async (key: 'email_notifications', value: boolean) => {
    await updateProfile({ [key]: value });
  };

  return (
    <ClientWrapper>
      <AccountLayout activeTab="notifications">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Bell size={24} className="text-[#C4818A]" />
          Notification Preferences
        </h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Info size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-gray-500">Get notified about your order status changes</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Package size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">Delivery Updates</p>
                <p className="text-sm text-gray-500">Track your package delivery progress</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C4818A]/10 flex items-center justify-center">
                <Tag size={20} className="text-[#C4818A]" />
              </div>
              <div>
                <p className="font-medium">Sales & Offers</p>
                <p className="text-sm text-gray-500">Be the first to know about deals and promotions</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={profile?.email_notifications ?? true}
              onCheckedChange={(checked) => updatePreferences('email_notifications', checked)}
            />
          </div>
        </div>
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
