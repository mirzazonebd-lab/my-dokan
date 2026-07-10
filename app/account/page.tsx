'use client';

import { useState, useEffect } from 'react';
import { Camera, Save, Loader as Loader2, User as UserIcon, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import AccountLayout from './AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await updateProfile({
      full_name: formData.full_name,
      phone: formData.phone
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <ClientWrapper>
      <AccountLayout activeTab="profile">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-semibold mb-6">Profile Information</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#C4818A] to-champagne-400 flex items-center justify-center text-white text-2xl font-semibold">
              {(formData.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center border border-gray-100"
              >
                <Camera size={14} className="text-gray-500" />
              </button>
            </div>
            <div>
              <p className="font-medium">{formData.full_name || 'Your Name'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <UserIcon size={14} className="inline mr-1" />
              Full Name
            </label>
            <Input
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone size={14} className="inline mr-1" />
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01700-000000"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail size={14} className="inline mr-1" />
              Email
            </label>
            <Input value={user?.email || ''} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="bg-[#C4818A] hover:bg-[#B06E77]">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            {saved && (
              <span className="text-sm text-green-600">Changes saved!</span>
            )}
          </div>
        </form>
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
