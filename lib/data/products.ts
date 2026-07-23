import { Product } from './types';
import { getProductsFromDB } from '@/lib/supabase/db';
import productsData from '@/data/products.json';

export async function getProducts(): Promise<Product[]> {
  try {
    // Try to fetch from Supabase
    const result = await getProductsFromDB();
    return result && result.length > 0 ? result : productsData as Product[];
  } catch (error: any) {
    // Fallback to JSON data
    console.log('Using fallback products data from JSON');
    return productsData as Product[];
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
    return data;
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
    return data;
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

export const products: Product[] = productsData as Product[];

export const getBestSellers = async () => {
  const all = await getProducts();
  return all.filter(p => p.badge === 'Best Seller').slice(0, 8);
};

export const getFlashSaleProducts = async () => {
  const all = await getProducts();
  return all.filter(p => p.badge === 'Sale').slice(0, 6);
};

export const getFeaturedProducts = async () => {
  const all = await getProducts();
  return all.filter(p => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 8);
};

export const getKoreanProducts = async () => {
  const all = await getProducts();
  return all.filter(p => p.category === 'Korean Skincare').slice(0, 8);
};

export const getNewArrivals = async () => {
  const all = await getProducts();
  return all.filter(p => p.badge === 'New').slice(0, 8);
};

export const getProductsByCategory = async (category: string) => {
  const all = await getProducts();
  return all.filter(p => p.category === category);
};

export const getProductsByBrand = async (brand: string) => {
  const all = await getProducts();
  return all.filter(p => p.brand === brand);
};

export const getProductBySlug = async (slug: string) => {
  const all = await getProducts();
  return all.find(p => p.slug === slug);
};
