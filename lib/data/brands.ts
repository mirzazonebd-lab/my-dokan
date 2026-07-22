import { Brand } from './types';

const defaultBrands: Brand[] = [
  {
    id: 'b001',
    name: 'COSRX',
    slug: 'cosrx',
    logo: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=200',
    country: 'South Korea',
    description: 'Science-driven Korean skincare brand known for simple, effective formulas.',
    isKorean: true,
    featured: true,
    productCount: 8,
  },
  {
    id: 'b002',
    name: 'Beauty of Joseon',
    slug: 'beauty-of-joseon',
    logo: 'https://images.pexels.com/photos/6621461/pexels-photo-6621461.jpeg?auto=compress&cs=tinysrgb&w=200',
    country: 'South Korea',
    description: 'Inspired by traditional Korean beauty secrets from the Joseon Dynasty.',
    isKorean: true,
    featured: true,
    productCount: 6,
  },
  {
    id: 'b003',
    name: 'Anua',
    slug: 'anua',
    logo: 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=200',
    country: 'South Korea',
    description: 'Clean beauty brand focused on heartleaf for calming sensitive, acne-prone skin.',
    isKorean: true,
    featured: true,
    productCount: 5,
  },
  {
    id: 'b004',
    name: 'SKIN1004',
    slug: 'skin1004',
    logo: 'https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=200',
    country: 'South Korea',
    description: 'Centella asiatica specialists. 1004 means "angel" in Korean.',
    isKorean: true,
    featured: true,
    productCount: 4,
  },
  {
    id: 'b005',
    name: 'Round Lab',
    slug: 'round-lab',
    logo: 'https://images.pexels.com/photos/2253834/pexels-photo-2253834.jpeg?auto=compress&cs=tinysrgb&w=200',
    country: 'South Korea',
    description: 'Clean, honest skincare brand known for the Birch Juice line.',
    isKorean: true,
    featured: true,
    productCount: 3,
  },
  {
    id: 'b006',
    name: 'Some By Mi',
    slug: 'some-by-mi',
    logo: 'https://images.pexels.com/photos/5069291/pexels-photo-5069291.jpeg?auto=compress&cs=tinysrgb&w=200',
    country: 'South Korea',
    description: 'Korean brand famous for the Miracle series.',
    isKorean: true,
    featured: true,
    productCount: 5,
  },
];

const BRANDS_STORAGE_KEY = 'beautydokanbd_admin_brands';

export function getBrands(): Brand[] {
  if (typeof window === 'undefined') return defaultBrands;
  
  const stored = localStorage.getItem(BRANDS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultBrands;
    }
  }
  
  localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(defaultBrands));
  return defaultBrands;
}

export function addBrand(brand: Brand) {
  if (typeof window === 'undefined') return;
  
  const brands = getBrands();
  brands.unshift(brand);
  localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
}

export function updateBrand(id: string, updates: Partial<Brand>) {
  if (typeof window === 'undefined') return;
  
  const brands = getBrands();
  const updated = brands.map(b => b.id === id ? { ...b, ...updates } : b);
  localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(updated));
}

export function deleteBrand(id: string) {
  if (typeof window === 'undefined') return;
  
  const brands = getBrands();
  const updated = brands.filter(b => b.id !== id);
  localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(updated));
}

export const brands: Brand[] = defaultBrands;
export const getFeaturedBrands = () => getBrands().filter(b => b.featured);
export const getKoreanBrands = () => getBrands().filter(b => b.isKorean);
export const getInternationalBrands = () => getBrands().filter(b => !b.isKorean);
