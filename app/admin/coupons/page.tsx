'use client';

import { useState } from 'react';
import { Plus, Pencil as Edit, Trash2, Ticket, Percent, Calendar, Users } from 'lucide-react';
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
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  status: 'active' | 'expired';
}

const mockCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME10', discount: 10, discountType: 'percentage', minPurchase: 500, usageLimit: 100, usedCount: 45, expiresAt: '2025-12-31', status: 'active' },
  { id: '2', code: 'SKIN20', discount: 20, discountType: 'percentage', minPurchase: 1500, usageLimit: 50, usedCount: 32, expiresAt: '2025-12-31', status: 'active' },
  { id: '3', code: 'BEAUTY15', discount: 15, discountType: 'percentage', minPurchase: 1000, usageLimit: 75, usedCount: 75, expiresAt: '2025-10-01', status: 'expired' },
  { id: '4', code: 'FLAT200', discount: 200, discountType: 'fixed', minPurchase: 2000, usageLimit: 200, usedCount: 120, expiresAt: '2026-06-30', status: 'active' },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    discountType: 'percentage',
    minPurchase: '',
  });

  const handleOpenSheet = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount.toString(),
        discountType: coupon.discountType,
        minPurchase: coupon.minPurchase.toString(),
      });
    } else {
      setEditingCoupon(null);
      setFormData({ code: '', discount: '', discountType: 'percentage', minPurchase: '' });
    }
    setIsSheetOpen(true);
  };

  const handleSaveCoupon = () => {
    if (!formData.code || !formData.discount) return;

    let updatedCoupons;
    if (editingCoupon) {
      // Update existing
      updatedCoupons = coupons.map(c =>
        c.id === editingCoupon.id
          ? {
              ...c,
              code: formData.code.toUpperCase(),
              discount: Number(formData.discount),
              discountType: formData.discountType as 'percentage' | 'fixed',
              minPurchase: Number(formData.minPurchase),
            }
          : c
      );
      setCoupons(updatedCoupons);
    } else {
      // Add new
      const newCoupon: Coupon = {
        id: Math.random().toString(36).substr(2, 9),
        code: formData.code.toUpperCase(),
        discount: Number(formData.discount),
        discountType: formData.discountType as 'percentage' | 'fixed',
        minPurchase: Number(formData.minPurchase),
        usageLimit: 100,
        usedCount: 0,
        expiresAt: '2026-12-31',
        status: 'active',
      };
      updatedCoupons = [newCoupon, ...coupons];
      setCoupons(updatedCoupons);
    }

    // Save to localStorage so checkout can read it
    localStorage.setItem('beautydokanbd_admin_coupons', JSON.stringify(updatedCoupons));

    setIsSheetOpen(false);
    setEditingCoupon(null);
    setFormData({ code: '', discount: '', discountType: 'percentage', minPurchase: '' });
  };

  const handleDeleteCoupon = (couponId: string, couponCode: string) => {
    if (confirm(`Delete coupon "${couponCode}"?`)) {
      const updatedCoupons = coupons.filter(c => c.id !== couponId);
      setCoupons(updatedCoupons);
      localStorage.setItem('beautydokanbd_admin_coupons', JSON.stringify(updatedCoupons));
    }
  };

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
            <SheetContent>
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
                  <Label htmlFor="discount">Discount Value</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="Value"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <select
                    id="discount-type"
                    className="h-9 px-3 rounded-lg border border-gray-200"
                    value={formData.discountType}
                    onChange={e => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (৳)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="min-purchase">Minimum Purchase (৳)</Label>
                  <Input
                    id="min-purchase"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.minPurchase}
                    onChange={e => setFormData({ ...formData, minPurchase: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveCoupon}
                  disabled={!formData.code || !formData.discount}
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
                <p className="text-2xl font-bold">{coupons.filter(c => c.status === 'active').length}</p>
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
                <p className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</p>
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
                <p className="text-2xl font-bold">{coupons.filter(c => c.discountType === 'percentage').length}</p>
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
                  <th className="text-left py-3 px-4 font-medium">Min Purchase</th>
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
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono">{coupon.code}</code>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `৳${coupon.discount}`}
                    </td>
                    <td className="py-3 px-4">৳{coupon.minPurchase}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C4818A] rounded-full"
                            style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{coupon.usedCount}/{coupon.usageLimit}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {coupon.status}
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
