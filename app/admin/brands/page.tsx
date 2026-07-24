'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil as Edit, Trash2 } from 'lucide-react';
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

export default function AdminBrandsPage() {
  const { token } = useAuth();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', country: '', description: '' });

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await fetch('/api/admin/brands');
        if (response.ok) {
          const { data } = await response.json();
          setBrands(data || []);
        }
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const handleOpenSheet = (brand?: any) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name, country: brand.country || '', description: brand.description || '' });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', country: '', description: '' });
    }
    setIsSheetOpen(true);
  };

  const handleSaveBrand = async () => {
    if (!formData.name) return;

    try {
      if (editingBrand) {
        const response = await fetch('/api/admin/brands', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: editingBrand.id,
            updates: {
              name: formData.name,
              country: formData.country,
              description: formData.description,
              is_korean: formData.country.toLowerCase().includes('korea'),
            },
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          setBrands(brands.map(b => b.id === editingBrand.id ? data : b));
        }
      } else {
        const response = await fetch('/api/admin/brands', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/[\s_]+/g, '-'),
            country: formData.country,
            description: formData.description,
            is_korean: formData.country.toLowerCase().includes('korea'),
            featured: false,
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          setBrands([data, ...brands]);
        }
      }

      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    if (confirm(`Delete brand "${brandName}"?`)) {
      try {
        const response = await fetch(`/api/admin/brands?id=${brandId}`, {
          method: 'DELETE',
          headers: {
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setBrands(brands.filter(b => b.id !== brandId));
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="brands">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-[#C4818A] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  const koreanBrands = brands.filter(b => b.is_korean);
  const internationalBrands = brands.filter(b => !b.is_korean);

  return (
    <AdminLayout activeTab="brands">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-500">{brands.length} brands</p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => handleOpenSheet()} className="bg-[#C4818A] hover:bg-[#B06E77]">
                <Plus size={16} className="mr-1" />
                Add Brand
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</SheetTitle>
                <SheetDescription>
                  {editingBrand ? 'Update the brand details.' : 'Create a new brand.'}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. COSRX"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g. South Korea"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Brand description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  onClick={handleSaveBrand}
                  disabled={!formData.name}
                  className="mt-4 bg-[#C4818A] hover:bg-[#B06E77]"
                >
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {koreanBrands.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">🌸 Korean Brands</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {koreanBrands.map(brand => (
                <div key={brand.id} className="bg-white rounded-xl border p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <Image src={brand.logo} alt={brand.name} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{brand.name}</h3>
                      <p className="text-xs text-gray-500">{brand.country}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenSheet(brand)}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBrand(brand.id, brand.name)}>
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {internationalBrands.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">🌍 International Brands</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {internationalBrands.map(brand => (
                <div key={brand.id} className="bg-white rounded-xl border p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <Image src={brand.logo} alt={brand.name} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{brand.name}</h3>
                      <p className="text-xs text-gray-500">{brand.country}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenSheet(brand)}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBrand(brand.id, brand.name)}>
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
