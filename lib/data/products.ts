import { Product } from './types';
import { getProductsFromDB } from '@/lib/supabase/db';
import productsData from '@/data/products.json';

const FALLBACK_IMAGE = '/placeholder.png';

type ProductInput = Partial<Product> & {
  id?: string; slug?: string; name?: string; price?: number;
  brand?: string | null; category?: string | null; image?: string | null;
};

const normalizeProduct = (product: ProductInput): Product => ({
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
  image: product.image ?? FALLBACK_IMAGE,
  badge: product.badge ?? null,
  description: product.description ?? null,
  featured: product.featured ?? false,
  active: product.active ?? true,
  rating: product.rating ?? 0,
  totalReviews: product.totalReviews ?? 0,
  shortDescription: product.shortDescription ?? '',
  fullDescription: product.fullDescription ?? null,
  ingredients: product.ingredients ?? null,
  skinType: product.skinType ?? null,
  usageInstructions: product.usageInstructions ?? '',
  gallery: product.gallery ?? [],
  created_at: product.created_at,
  updated_at: product.updated_at,
});

const normalizeProducts = (items: ProductInput[] = []): Product[] => items.map(normalizeProduct);

export async function getProducts(): Promise<Product[]> {
  try {
    const result = await getProductsFromDB();
    return result.length > 0
      ? normalizeProducts(result as ProductInput[])
      : normalizeProducts(productsData as ProductInput[]);
  } catch {
    return normalizeProducts(productsData as ProductInput[]);
  }
}

export async function addProduct(product: Product): Promise<Product> {
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error(`Failed to add product: ${response.statusText}`);
  const { data } = await response.json();
  return normalizeProduct(data as ProductInput);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const response = await fetch('/api/admin/products', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '' },
    body: JSON.stringify({ id, updates }),
  });
  if (!response.ok) throw new Error(`Failed to update product: ${response.statusText}`);
  const { data } = await response.json();
  return normalizeProduct(data as ProductInput);
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/admin/products?id=${id}`, {
    method: 'DELETE',
    headers: { 'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '' },
  });
  if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`);
}

export const products: Product[] = normalizeProducts(productsData as ProductInput[]);
export const getBestSellers = async () => (await getProducts()).filter((p) => p.badge === 'Best Seller').slice(0, 8);
export const getFlashSaleProducts = async () => (await getProducts()).filter((p) => p.badge === 'Sale').slice(0, 6);
export const getFeaturedProducts = async () => (await getProducts()).filter((p) => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 8);
export const getKoreanProducts = async () => (await getProducts()).filter((p) => p.category === 'Korean Skincare').slice(0, 8);
export const getNewArrivals = async () => (await getProducts()).filter((p) => p.badge === 'New').slice(0, 8);
export const getProductsByCategory = async (category: string) => (await getProducts()).filter((p) => p.category === category);
export const getProductsByBrand = async (brand: string) => (await getProducts()).filter((p) => p.brand === brand);
export const getProductBySlug = async (slug: string) => (await getProducts()).find((p) => p.slug === slug);
