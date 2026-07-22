import { Category } from './types';

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
  {
    id: 'c003',
    name: 'Skincare',
    slug: 'skincare',
    image: 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Moisturisers, serums, cleansers & essentials',
    productCount: 88,
    icon: '✨',
  },
  {
    id: 'c004',
    name: 'Hair Care',
    slug: 'hair-care',
    image: 'https://images.pexels.com/photos/5217882/pexels-photo-5217882.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Shampoos, conditioners, masks & treatments',
    productCount: 64,
    icon: '💆',
  },
  {
    id: 'c005',
    name: 'Body Care',
    slug: 'body-care',
    image: 'https://images.pexels.com/photos/6621461/pexels-photo-6621461.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Lotions, scrubs, body washes & oils',
    productCount: 52,
    icon: '🧴',
  },
];

const CATEGORIES_STORAGE_KEY = 'beautydokanbd_admin_categories';

export function getCategories(): Category[] {
  if (typeof window === 'undefined') return defaultCategories;
  
  const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultCategories;
    }
  }
  
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
}

export function addCategory(category: Category) {
  if (typeof window === 'undefined') return;
  
  const categories = getCategories();
  categories.unshift(category);
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

export function updateCategory(id: string, updates: Partial<Category>) {
  if (typeof window === 'undefined') return;
  
  const categories = getCategories();
  const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
}

export function deleteCategory(id: string) {
  if (typeof window === 'undefined') return;
  
  const categories = getCategories();
  const updated = categories.filter(c => c.id !== id);
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
}

export const categories: Category[] = defaultCategories;
