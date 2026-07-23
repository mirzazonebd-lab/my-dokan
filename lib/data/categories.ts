import { Category } from './types';
import { getCategoriesFromDB } from '@/lib/supabase/db';

const defaultCategories: Category[] = [
  {
    id: 'c001',
    name: 'Korean Skincare',
    slug: 'korean-skincare',
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Authentic K-beauty routines and cult-favourite products',
    productCount: 120,
    icon: '🌸',
  },
  {
    id: 'c002',
    name: 'Makeup',
    slug: 'makeup',
    image: 'https://images.pexels.com/photos/2688993/pexels-photo-2688993.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Foundations, lipsticks, eye makeup & more',
    productCount: 95,
    icon: '💄',
  },
];

export async function getCategories(): Promise<Category[]> {
  try {
    return await getCategoriesFromDB();
  } catch (error) {
    console.error('Failed to fetch categories from Supabase:', error);
    return defaultCategories;
  }
}

export async function addCategory(category: Category): Promise<Category> {
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) throw new Error(`Failed to add category: ${response.statusText}`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
      body: JSON.stringify({ id, updates }),
    });

    if (!response.ok) throw new Error(`Failed to update category: ${response.statusText}`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/categories?id=${id}`, {
      method: 'DELETE',
      headers: {
        'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY || '',
      },
    });

    if (!response.ok) throw new Error(`Failed to delete category: ${response.statusText}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export const categories: Category[] = defaultCategories;
