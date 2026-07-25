'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil as Edit, Trash2, Ticket, Percent, Users } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Coupon {
  id: string;
  code: string;
  discount_value: number;
  discount_type: 'percentage' | 'fixed';
  min_order_value: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
}

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_value: '',
    discount_type: 'percentage',
    min_order_value: '',
    max_uses: '',
    expires_at: '',
  });

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await fetch('/api/admin/coupons', {
          headers: {
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const { data } = await response.json();
          setCoupons(data || []);
        }
      } catch (error) {
        console.error('Error loading coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadCoupons();
  }, [token]);

  const handleOpenSheet = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount_value: coupon.discount_value.toString(),
        discount_type: coupon.discount_type,
        min_order_value: coupon.min_order_value?.toString() || '',
        max_uses: coupon.max_uses?.toString() || '',
        expires_at: coupon.expires_at || '',
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount_value: '',
        discount_type: 'percentage',
        min_order_value: '',
        max_uses: '',
        expires_at: '',
      });
    }
    setIsSheetOpen(true);
  };

  const handleSaveCoupon = async () => {
    if (!formData.code || !formData.discount_value) return;

    try {
      if (editingCoupon) {
        const response = await fetch('/api/admin/coupons', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: editingCoupon.id,
            updates: {
              code: formData.code.toUpperCase(),
              discount_value: Number(formData.discount_value),
              discount_type: formData.discount_type,
              min_order_value: formData.min_order_value ? Number(formData.min_order_value) : null,
              max_uses: formData.max_uses ? Number(formData.max_uses) : null,
              expires_at: formData.expires_at || null,
            },
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          setCoupons(coupons.map(c => c.id === editingCoupon.id ? data : c));
        }
      } else {
        const response = await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: formData.code.toUpperCase(),
            discount_value: Number(formData.discount_value),
            discount_type: formData.discount_type,
            min_order_value: formData.min_order_value ? Number(formData.min_order_value) : null,
            max_uses: formData.max_uses ? Number(formData.max_uses) : null,
            expires_at: formData.expires_at || null,
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          setCoupons([data, ...coupons]);
        }
      }

      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleDeleteCoupon = async (couponId: string, couponCode: string) => {
    if (confirm(`Delete coupon "${couponCode}"?`)) {
      try {
        const response = await fetch(`/api/admin/coupons?id=${couponId}`, {
          method: 'DELETE',
          headers: {
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setCoupons(coupons.filter(c => c.id !== couponId));
        }
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="coupons">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-[#C4818A] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  const activeCoupons = coupons.filter(c => c.active);
  const totalUses = coupons.reduce((sum, c) => sum + c.used_count, 0);
  const percentageCoupons = coupons.filter(c => c.discount_type === 'percentage');

  return (
    <AdminLayout activeTab="coupons">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
            <p className="text-gray-500">{coupons.length} coupons</p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => handleOpenSheet()} className="bg-[#C4818A] hover:bg-[#B06E77]">
                <Plus size={16} className="mr-1" />
                Add Coupon
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</SheetTitle>
                <SheetDescription>
                  {editingCoupon ? 'Update the coupon details.' : 'Create a new discount coupon.'}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <Input
                    id="coupon-code"
                    placeholder="e.g. SUMMER20"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    placeholder="Value"
                    value={formData.discount_value}
                    onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <select
                    id="discount_type"
                    className="h-9 px-3 rounded-lg border border-gray-200"
                    value={formData.discount_type}
                    onChange={e => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (৳)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="min_order_value">Minimum Order (৳)</Label>
                  <Input
                    id="min_order_value"
                    type="number"
                    placeholder="Optional"
                    value={formData.min_order_value}
                    onChange={e => setFormData({ ...formData, min_order_value: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_uses">Max Uses</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    placeholder="Optional (leave blank for unlimited)"
                    value={formData.max_uses}
                    onChange={e => setFormData({ ...formData, max_uses: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expires_at">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveCoupon}
                  disabled={!formData.code || !formData.discount_value}
                  className="mt-4 bg-[#C4818A] hover:bg-[#B06E77]"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Ticket size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCoupons.length}</p>
                <p className="text-xs text-gray-500">Active Coupons</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUses}</p>
                <p className="text-xs text-gray-500">Total Uses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C4818A]/10 flex items-center justify-center">
                <Percent size={20} className="text-[#C4818A]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{percentageCoupons.length}</p>
                <p className="text-xs text-gray-500">Percentage Discounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Code</th>
                  <th className="text-left py-3 px-4 font-medium">Discount</th>
                  <th className="text-left py-3 px-4 font-medium">Min Order</th>
                  <th className="text-left py-3 px-4 font-medium">Usage</th>
                  <th className="text-left py-3 px-4 font-medium">Expires</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-center py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{coupon.code}</code>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `৳${coupon.discount_value}`}
                    </td>
                    <td className="py-3 px-4 text-sm">৳{coupon.min_order_value || '-'}</td>
                    <td className="py-3 px-4 text-sm">{coupon.used_count}/{coupon.max_uses || '∞'}</td>
                    <td className="py-3 px-4 text-sm">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenSheet(coupon)}><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}><Trash2 size={14} className="text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
