'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import AdminLayout from '../../../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        brand: '',
        stock: '',
        image: '',
        badge: 'none',
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single();
                if (error) throw error;
                if (data) {
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        price: data.price?.toString() || '',
                        originalPrice: data.compare_price?.toString() || '',
                        category: data.category || '',
                        brand: data.brand || '',
                        stock: data.stock?.toString() || '',
                        image: data.image || '',
                        badge: data.badge || 'none',
                    });
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Failed to load product details');
            } finally {
                setFetching(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: params.id,
                    updates: {
                        name: formData.name,
                        slug: formData.name.toLowerCase().replace(/[\s_]+/g, '-'),
                        price: Number(formData.price),
                        compare_price: formData.originalPrice ? Number(formData.originalPrice) : null,
                        category: formData.category,
                        brand: formData.brand,
                        stock: Number(formData.stock),
                        image: formData.image,
                        description: formData.description,
                        badge: formData.badge === 'none' ? null : formData.badge,
                    },
                }),
            });

            if (response.ok) {
                alert('Product updated successfully!');
                router.push('/admin/products');
            } else {
                const errorData = await response.json();
                alert(`Failed to update product: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Error updating product:', error);
            alert(`Network error: ${error.message || 'Failed to update product'}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <AdminLayout activeTab="products">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-[#C4818A] border-t-transparent rounded-full" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activeTab="products">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-500">Update product information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter product description" rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                        <Input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                                        <Input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                    <Input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
                                            <option value="">Select category</option>
                                            <option value="Skincare">Skincare</option>
                                            <option value="Makeup">Makeup</option>
                                            <option value="Hair Care">Hair Care</option>
                                            <option value="K-Beauty">K-Beauty</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                        <select name="brand" value={formData.brand} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
                                            <option value="">Select brand</option>
                                            <option value="COSRX">COSRX</option>
                                            <option value="Maybelline">Maybelline</option>
                                            <option value="L'Oreal">L&apos;Oreal</option>
                                            <option value="MAC">MAC</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Badge</h2>
                                <select name="badge" value={formData.badge} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
                                    <option value="none">None</option>
                                    <option value="New">New</option>
                                    <option value="Best Seller">Best Seller</option>
                                    <option value="Sale">Sale</option>
                                </select>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
                                    <Input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/admin/products">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-[#C4818A] hover:bg-[#B06E77]">
                            {loading ? 'Updating...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
