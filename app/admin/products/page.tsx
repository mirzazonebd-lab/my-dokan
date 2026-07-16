'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Plus,
  Search,
  CreditCard as Edit,
  Trash2,
  Eye,
} from 'lucide-react';

import { supabase } from '@/lib/supabase/client';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  image: string | null;
  featured: boolean;
  active: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.category)
            .filter(Boolean)
        )
      ),
    [products]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.brand)
            .filter(Boolean)
        )
      ),
    [products]
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (product.brand ?? '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' ||
      product.category === filterCategory;

    const matchesBrand =
      filterBrand === 'all' ||
      product.brand === filterBrand;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand
    );
  });

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-6">
              {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products
            </h1>

            <p className="text-gray-500">
              {filteredProducts.length} products
            </p>
          </div>

          <Button className="bg-[#C4818A] hover:bg-[#B06E77]">
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-3 h-10"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((cat) => (
              <option key={cat} value={cat ?? ''}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 h-10"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="all">All Brands</option>

            {brands.map((brand) => (
              <option key={brand} value={brand ?? ''}>
                {brand}
              </option>
            ))}
          </select>

        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">

          {selectedProducts.length > 0 && (
            <div className="border-b bg-gray-50 px-4 py-3 flex items-center gap-3">

              <span className="text-sm text-gray-500">
                {selectedProducts.length} selected
              </span>

              <Button variant="outline" size="sm">
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
              >
                Delete
              </Button>

            </div>
          )}

          {loading ? (

            <div className="p-10 text-center">
              Loading...
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                  <tr>

                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          filteredProducts.length > 0 &&
                          selectedProducts.length === filteredProducts.length
                        }
                        onChange={toggleAll}
                      />
                    </th>

                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-left px-4 py-3">Brand</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-center px-4 py-3">Stock</th>
                    <th className="text-center px-4 py-3">Actions</th>

                  </tr>

                </thead>

                <tbody className="divide-y">
                  {filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProduct(product.id)}
                        />
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">

                            <Image
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />

                          </div>

                          <div>

                            <div className="font-medium">
                              {product.name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {product.slug}
                            </div>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-3">
                        {product.category ?? '-'}
                      </td>

                      <td className="px-4 py-3">
                        {product.brand ?? '-'}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div>৳{product.price}</div>

                        {product.compare_price && (
                          <div className="text-xs text-gray-400 line-through">
                            ৳{product.compare_price}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {product.stock}
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex justify-center gap-2">

                          <Link href={`/product/${product.slug}`}>
                            <Eye size={16} />
                          </Link>

                          <button type="button">
                            <Edit size={16} />
                          </button>

                          <button type="button">
                            <Trash2
                              size={16}
                              className="text-red-500"
                            />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-gray-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AdminLayout>

  );
}