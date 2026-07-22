'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil as Edit, Trash2, Globe, Sparkles } from 'lucide-react';
import { getBrands, addBrand, updateBrand, deleteBrand } from '@/lib/data/brands';
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
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedBrands = getBrands();
    setBrands(loadedBrands);
    setLoading(false);
  }, []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', country: '', description: '' });

  const handleOpenSheet = (brand?: any) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name, country: brand.country, description: brand.description });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', country: '', description: '' });
    }
    setIsSheetOpen(true);
  };

  const handleSaveBrand = () => {
    if (!formData.name) return;

    if (editingBrand) {
      // Update existing
      const updated = {
        ...editingBrand,
        name: formData.name,
        country: formData.country,
        description: formData.description,
        isKorean: formData.country.toLowerCase().includes('korea'),
      };
      const updatedBrands = brands.map(b => b.id === editingBrand.id ? updated : b);
      setBrands(updatedBrands);
      updateBrand(editingBrand.id, updated);
    } else {
      // Add new
      const newBrand = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        logo: '/placeholder.png',
        country: formData.country,
        description: formData.description,
        isKorean: formData.country.toLowerCase().includes('korea'),
        featured: false,
        productCount: 0,
      };
      setBrands([newBrand as any, ...brands]);
      addBrand(newBrand as any);
    }

    setIsSheetOpen(false);
    setEditingBrand(null);
    setFormData({ name: '', country: '', description: '' });
  };

  const handleDeleteBrand = (brandId: string, brandName: string) => {
    if (confirm(`Delete brand "${brandName}"?`)) {
      const updated = brands.filter(b => b.id !== brandId);
      setBrands(updated);
      deleteBrand(brandId);
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

  const koreanBrands = brands.filter(b => b.isKorean);
  const internationalBrands = brands.filter(b => !b.isKorean);

  return (
    <AdminLayout activeTab="brands">
      <div className="space-y-6">
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
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
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
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

        {/* Korean Brands */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-rose-500" size={20} />
            <h2 className="text-lg font-semibold">Korean Brands ({koreanBrands.length})</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {koreanBrands.map(brand => (
              <BrandCard key={brand.id} brand={brand} onEdit={() => handleOpenSheet(brand)} onDelete={() => handleDeleteBrand(brand.id, brand.name)} />
            ))}
          </div>
        </div>

        {/* International Brands */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold">International Brands ({internationalBrands.length})</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {internationalBrands.map(brand => (
              <BrandCard key={brand.id} brand={brand} onEdit={() => handleOpenSheet(brand)} onDelete={() => handleDeleteBrand(brand.id, brand.name)} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function BrandCard({ brand, onEdit, onDelete }: { brand: any; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          className="object-cover"
        />
        {brand.country === 'South Korea' && (
          <span className="absolute top-2 right-2 text-sm">🇰🇷</span>
        )}
        {brand.country === 'USA' && (
          <span className="absolute top-2 right-2 text-sm">🇺🇸</span>
        )}
        {brand.country === 'France' && (
          <span className="absolute top-2 right-2 text-sm">🇫🇷</span>
        )}
        {brand.country === 'Canada' && (
          <span className="absolute top-2 right-2 text-sm">🇨🇦</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{brand.name}</h3>
          {brand.featured && (
            <span className="text-xs px-2 py-0.5 bg-champagne-100 text-champagne-700 rounded-full">
              Featured
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">{brand.country}</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{brand.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{brand.productCount || 0} products</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}><Edit size={14} /></Button>
            <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 size={14} className="text-red-500" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
