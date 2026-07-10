'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, CreditCard as Edit, Trash2, Eye, Filter } from 'lucide-react';
import { products } from '@/lib/data/products';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Get unique categories and brands
  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500">{products.length} products</p>
          </div>
          <Button className="bg-[#C4818A] hover:bg-[#B06E77]">
            <Plus size={16} className="mr-1" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="h-10 px-4 rounded-lg border border-gray-200"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            className="h-10 px-4 rounded-lg border border-gray-200"
          >
            <option value="all">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
              <span className="text-sm text-gray-600">{selectedProducts.length} selected</span>
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Brand</th>
                  <th className="text-right py-3 px-4 font-medium">Price</th>
                  <th className="text-center py-3 px-4 font-medium">Stock</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-center py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.category}</td>
                    <td className="py-3 px-4 text-sm">{product.brand}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="font-medium">৳{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through ml-1">৳{product.originalPrice}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                        product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {product.badge === 'New' && <span className="text-xs px-1 bg-blue-100 text-blue-600 rounded">New</span>}
                        {product.badge === 'Best Seller' && <span className="text-xs px-1 bg-amber-100 text-amber-600 rounded">Hot</span>}
                        {product.badge === 'Sale' && <span className="text-xs px-1 bg-orange-100 text-orange-600 rounded">Sale</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-1.5 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye size={16} className="text-gray-500" />
                        </Link>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                          <Edit size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} className="text-red-500" />
                        </button>
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
