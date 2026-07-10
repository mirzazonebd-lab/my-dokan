'use client';

import { useState } from 'react';
import { Package, TrendingDown, Search } from 'lucide-react';
import { products } from '@/lib/data/products';
import AdminLayout from '../AdminShell';
import { Input } from '@/components/ui/input';

export default function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const inStockProducts = products.filter(p => p.stockStatus === 'in_stock');
  const outOfStockProducts = products.filter(p => p.stockStatus !== 'in_stock');
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout activeTab="inventory">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">Manage stock levels and product availability</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Package size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inStockProducts.length}</p>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <TrendingDown size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">{outOfStockProducts.length}</p>
                <p className="text-xs text-gray-600">Out of Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.slice(0, 20).map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{product.name}</span>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{product.id}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                        product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
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
