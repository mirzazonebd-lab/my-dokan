'use client';

import { useState } from 'react';
import { Settings, Moon, Sun, Key, Shield, Globe } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import AccountLayout from '../AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { profile, updateProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(profile?.dark_mode ?? false);

  const handleDarkModeToggle = async (checked: boolean) => {
    setDarkMode(checked);
    await updateProfile({ dark_mode: checked });

    // Apply dark mode
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ClientWrapper>
      <AccountLayout activeTab="settings">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Settings size={24} className="text-[#C4818A]" />
          Settings
        </h1>

        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Appearance</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Privacy & Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <Key size={20} />
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield size={20} />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </div>

          {/* Regional */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Regional</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe size={20} />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-500">Select your preferred language</p>
                  </div>
                </div>
                <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
                  <option>English</option>
                  <option>Bengali (বাংলা)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <p className="text-lg">৳</p>
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-gray-500">Display prices in your preferred currency</p>
                  </div>
                </div>
                <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
                  <option>BDT (৳)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
