import { Product } from './types';
import productsData from '@/data/products.json';

export const products: Product[] = productsData as Product[];

export const getBestSellers = () => products.filter(p => p.badge === 'Best Seller').slice(0, 8);
export const getFlashSaleProducts = () => products.filter(p => p.badge === 'Sale').slice(0, 6);
export const getFeaturedProducts = () => products.filter(p => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 8);
export const getKoreanProducts = () => products.filter(p => p.category === 'Korean Skincare').slice(0, 8);
export const getNewArrivals = () => products.filter(p => p.badge === 'New').slice(0, 8);
export const getProductsByCategory = (category: string) =>
  products.filter(p => p.category === category);
export const getProductsByBrand = (brand: string) =>
  products.filter(p => p.brand === brand);
export const getProductBySlug = (slug: string) =>
  products.find(p => p.slug === slug);
