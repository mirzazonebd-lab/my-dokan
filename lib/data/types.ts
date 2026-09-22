export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compare_price?: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  stock: number;
  stockStatus?: 'in_stock' | 'out_of_stock' | string | null;
  image: string | null;
  badge?: string | null;
  description?: string | null;
  featured?: boolean;
  active?: boolean;
  rating?: number | null;
  totalReviews?: number | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  ingredients?: string | null;
  skinType?: string | null;
  usageInstructions?: string | null;
  gallery?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  location: string;
  verified: boolean;
  helpful: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string;
  description: string;
  isKorean: boolean;
  featured: boolean;
  productCount?: number;
  is_korean?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number | null;
  max_uses?: number | null;
  used_count: number;
  expires_at?: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEMO_ADDRESSES: Address[] = [
  {
    id: 'addr-001',
    user_id: 'demo-user-001',
    name: 'Demo User',
    phone: '+880 1700-000000',
    address: '123 Gulshan Avenue',
    city: 'Dhaka',
    district: 'Dhaka',
    postal_code: '1212',
    is_default: true,
    created_at: new Date().toISOString(),
    email: 'demo@beautydokanbd.com',
  },
  {
    id: 'addr-002',
    user_id: 'demo-user-001',
    name: 'Demo User (Office)',
    phone: '+880 1800-000000',
    address: '456 Banani Road',
    city: 'Dhaka',
    district: 'Dhaka',
    postal_code: '1213',
    is_default: false,
    created_at: new Date().toISOString(),
    email: '',
  },
];
