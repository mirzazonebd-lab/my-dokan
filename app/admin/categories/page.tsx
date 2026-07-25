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

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const { data } = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleOpenSheet = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsSheetOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name) return;

    try {
      if (editingCategory) {
        const response = await fetch('/api/admin/categories', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: editingCategory.id,
            updates: {
              name: formData.name,
              description: formData.description,
            },
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          setCategories(categories.map(c => c.id === editingCategory.id ? data : c));
        }
      } else {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/[\s_]+/g, '-'),
            description: formData.description,
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          setCategories([data, ...categories]);
        }
      }

      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (confirm(`Delete category "${categoryName}"?`)) {
      try {
        const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
          method: 'DELETE',
          headers: {
            'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setCategories(categories.filter(c => c.id !== categoryId));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="categories">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-[#C4818A] border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="categories">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500">{categories.length} categories</p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => handleOpenSheet()} className="bg-[#C4818A] hover:bg-[#B06E77]">
                <Plus size={16} className="mr-1" />
                Add Category
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</SheetTitle>
                <SheetDescription>
                  {editingCategory ? 'Update the category details.' : 'Create a new product category.'}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g. Skin Care"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Input
                    id="cat-desc"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveCategory}
                  disabled={!formData.name}
                  className="mt-4 bg-[#C4818A] hover:bg-[#B06E77]"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-2xl">{category.icon}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">/{category.slug}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenSheet(category)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
