import { Brand } from './types';
import { getBrandsFromDB } from '@/lib/supabase/db';

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
];

export async function getBrands(): Promise<Brand[]> {
  try {
    return await getBrandsFromDB();
  } catch (error) {
    console.error('Failed to fetch brands from Supabase:', error);
    return defaultBrands;
  }
}

export async function addBrand(brand: Brand): Promise<Brand> {
  try {
    const response = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
      body: JSON.stringify(brand),
    });

    if (!response.ok) throw new Error(`Failed to add brand: ${response.statusText}`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding brand:', error);
    throw error;
  }
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
  try {
    const response = await fetch('/api/admin/brands', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
      body: JSON.stringify({ id, updates }),
    });

    if (!response.ok) throw new Error(`Failed to update brand: ${response.statusText}`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
}

export async function deleteBrand(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/brands?id=${id}`, {
      method: 'DELETE',
      headers: {
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
    });

    if (!response.ok) throw new Error(`Failed to delete brand: ${response.statusText}`);
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
}

export const brands: Brand[] = defaultBrands;

export const getFeaturedBrands = async () => {
  const all = await getBrands();
  return all.filter(b => b.featured);
};

export const getKoreanBrands = async () => {
  const all = await getBrands();
  return all.filter(b => b.isKorean);
};

export const getInternationalBrands = async () => {
  const all = await getBrands();
  return all.filter(b => !b.isKorean);
};
