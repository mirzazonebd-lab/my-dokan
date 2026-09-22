import { Product } from './types';
import { getProductsFromDB } from '@/lib/supabase/db';
import productsData from '@/data/products.json';

const normalizeProduct = (
  product: Partial<Product> & { id?: string; slug?: string; name?: string; price?: number; brand?: string | null; category?: string | null; image?: string | null }
): Product => ({
  id: product.id ?? crypto.randomUUID(),
  slug: product.slug ?? product.id ?? crypto.randomUUID(),
  name: product.name ?? 'Unnamed Product',
  brand: product.brand ?? 'Unknown Brand',
  category: product.category ?? 'General',
  price: product.price ?? 0,
  compare_price: product.compare_price ?? null,
  originalPrice: product.originalPrice ?? null,
  discountPercent: product.discountPercent ?? null,
  stock: product.stock ?? (product.stockStatus === 'in_stock' ? 999 : 0),
  stockStatus: product.stockStatus ?? 'in_stock',
  image: product.image ?? null,
  badge: product.badge ?? null,
  description: product.description ?? null,
  featured: product.featured ?? false,
  active: product.active ?? true,
  rating: product.rating ?? 0,
  totalReviews: product.totalReviews ?? 0,
  shortDescription: product.shortDescription ?? null,
  fullDescription: product.fullDescription ?? null,
  ingredients: product.ingredients ?? null,
  skinType: product.skinType ?? null,
  usageInstructions: product.usageInstructions ?? null,
  gallery: product.gallery ?? [],
  created_at: product.created_at ?? new Date().toISOString(),
  updated_at: product.updated_at ?? new Date().toISOString(),
});

const normalizeProducts = (items: Array<Partial<Product>> = []) => items.map(normalizeProduct);

export async function getProducts(): Promise<Product[]> {
  try {
    const result = await getProductsFromDB();
    if (result && result.length > 0) {
      return normalizeProducts(result as Array<Partial<Product>>);
    }
    return normalizeProducts(productsData as Array<Partial<Product>>);
  } catch (error: unknown) {
    console.log('Using fallback products data from JSON');
    return normalizeProducts(productsData as Array<Partial<Product>>);
  }
}

export async function addProduct(product: Product): Promise<Product> {
  try {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error(`Failed to add product: ${response.statusText}`);
    const { data } = await response.json();
    return normalizeProduct(data as Partial<Product>);
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
      body: JSON.stringify({ id, updates }),
    });

    if (!response.ok) throw new Error(`Failed to update product: ${response.statusText}`);
    const { data } = await response.json();
    return normalizeProduct(data as Partial<Product>);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/products?id=${id}`, {
      method: 'DELETE',
      headers: {
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
    });

    if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export const products: Product[] = normalizeProducts(productsData as Array<Partial<Product>>);

export const getBestSellers = async () => {
  const all = await getProducts();
  return all.filter((p) => p.badge === 'Best Seller').slice(0, 8);
};

export const getFlashSaleProducts = async () => {
  const all = await getProducts();
  return all.filter((p) => p.badge === 'Sale').slice(0, 6);
};

export const getFeaturedProducts = async () => {
  const all = await getProducts();
  return all.filter((p) => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 8);
};

export const getKoreanProducts = async () => {
  const all = await getProducts();
  return all.filter((p) => p.category === 'Korean Skincare').slice(0, 8);
};

export const getNewArrivals = async () => {
  const all = await getProducts();
  return all.filter((p) => p.badge === 'New').slice(0, 8);
};

export const getProductsByCategory = async (category: string) => {
  const all = await getProducts();
  return all.filter((p) => p.category === category);
};

export const getProductsByBrand = async (brand: string) => {
  const all = await getProducts();
  return all.filter((p) => p.brand === brand);
};

export const getProductBySlug = async (slug: string) => {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
};
