'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  PackageSearch,
  Loader2,
} from 'lucide-react';
import { products as initialProducts } from '@/lib/data/products';
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const defaultForm = {
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    brand: '',
    image: '',
  };
  const [formData, setFormData] = useState(defaultForm);

  // When sheet closes, clear editing state
  useEffect(() => {
    if (!isSheetOpen) {
      setEditingProduct(null);
      setFormData(defaultForm);
    }
  }, [isSheetOpen]);

  useEffect(() => {
    setProducts(initialProducts as any[]);
    setLoading(false);
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
      ) as string[],
    [products]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.brand).filter(Boolean))
      ) as string[],
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          (product.brand ?? '').toLowerCase().includes(q);
        const matchesCategory =
          filterCategory === 'all' || product.category === filterCategory;
        const matchesBrand =
          filterBrand === 'all' || product.brand === filterBrand;
        return matchesSearch && matchesCategory && matchesBrand;
      }),
    [products, searchQuery, filterCategory, filterBrand]
  );

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleSaveProduct = async () => {
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingProduct) {
      // Update existing
      const updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
            price: Number(formData.price),
            stock: Number(formData.stock),
            description: formData.description,
            category: formData.category || null,
            brand: formData.brand || null,
            image: formData.image || '/placeholder.png',
          };
        }
        return p;
      });
      setProducts(updatedProducts);
    } else {
      // Insert new
      const newProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        category: formData.category || null,
        brand: formData.brand || null,
        image: formData.image || '/placeholder.png',
        active: true,
        featured: false,
      };
      setProducts([newProduct as any, ...products]);
    }

    setIsSheetOpen(false);
    setIsSubmitting(false);
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || '',
      image: product.image || '',
    });
    setIsSheetOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      setSelectedProducts(selectedProducts.filter(selId => selId !== id));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500">
              {loading ? 'Loading...' : `${filteredProducts.length} products`}
            </p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-[#C4818A] hover:bg-[#B06E77]">
                <Plus size={16} className="mr-2" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
                <SheetDescription>
                  {editingProduct
                    ? 'Update the details below to edit this product.'
                    : 'Fill in the details below to add a new product to your catalog.'}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo">Product Photo</Label>
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
                  <div className="text-xs text-gray-500 text-center my-1">OR</div>
                  <Input
                    placeholder="Paste image URL here"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  {formData.image && (
                    <div className="mt-2 w-full h-32 relative bg-gray-100 rounded overflow-hidden">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (৳)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="Stock quantity"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="Brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Write a short description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveProduct}
                  disabled={isSubmitting || !formData.name || !formData.price}
                  className="mt-4 bg-[#C4818A] hover:bg-[#B06E77]"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    'Save Product'
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
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
              placeholder="Search by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-3 h-10 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 h-10 text-sm"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
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
              <Button variant="outline" size="sm" className="text-red-600">
                Delete
              </Button>
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center">
              <Loader2 size={28} className="mx-auto mb-3 text-[#C4818A] animate-spin" />
              <p className="text-gray-500 text-sm">Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        aria-label="Select all"
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
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${product.name}`}
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProduct(product.id)}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                            <Image
                              src={product.image || '/placeholder.png'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.category ?? '-'}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.brand ?? '-'}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-gray-900">
                          ৳{product.price}
                        </div>
                        {product.compare_price ? (
                          <div className="text-xs text-gray-400 line-through">
                            ৳{product.compare_price}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                            }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="text-gray-500 hover:text-[#C4818A] transition-colors"
                            aria-label="View product"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-[#C4818A] transition-colors"
                            aria-label="Edit product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600 transition-colors"
                            aria-label="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <PackageSearch
                          size={32}
                          className="mx-auto mb-3 text-gray-300"
                        />
                        <p className="text-gray-500 font-medium">
                          No products found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search or filters.
                        </p>
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
