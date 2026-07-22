import { Product } from './types';
import productsData from '@/data/products.json';

const PRODUCTS_STORAGE_KEY = 'beautydokanbd_admin_products';

// Get products from localStorage or use default
export function getProducts(): Product[] {
  if (typeof window === 'undefined') {
    // Server-side: return default products
    return productsData as Product[];
  }
  
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return productsData as Product[];
    }
  }
  
  // First time: save default products to localStorage
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsData));
  return productsData as Product[];
}

// Initialize products (call this on app startup)
export function initializeProducts() {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsData));
  }
}

// Update a product in localStorage
export function updateProduct(id: string, updates: Partial<Product>) {
  if (typeof window === 'undefined') return;
  
  const products = getProducts();
  const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
}

// Delete a product
export function deleteProduct(id: string) {
  if (typeof window === 'undefined') return;
  
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
}

// Add a product
export function addProduct(product: Product) {
  if (typeof window === 'undefined') return;
  
  const products = getProducts();
  products.unshift(product);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

// Get all products (for backward compatibility, but use getProducts() instead)
export const products: Product[] = productsData as Product[];

export const getBestSellers = () => getProducts().filter(p => p.badge === 'Best Seller').slice(0, 8);
export const getFlashSaleProducts = () => getProducts().filter(p => p.badge === 'Sale').slice(0, 6);
export const getFeaturedProducts = () => getProducts().filter(p => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 8);
export const getKoreanProducts = () => getProducts().filter(p => p.category === 'Korean Skincare').slice(0, 8);
export const getNewArrivals = () => getProducts().filter(p => p.badge === 'New').slice(0, 8);
export const getProductsByCategory = (category: string) =>
  getProducts().filter(p => p.category === category);
export const getProductsByBrand = (brand: string) =>
  getProducts().filter(p => p.brand === brand);
export const getProductBySlug = (slug: string) =>
  getProducts().find(p => p.slug === slug);
