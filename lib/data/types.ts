export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string | null;
  price: number;
  compare_price?: number | null;
  stock: number;
  image: string | null;
  badge?: string | null;
  description?: string | null;
  featured?: boolean;
  active?: boolean;
  rating?: number;
  totalReviews?: number;
  stockStatus?: string;
  shortDescription?: string;
  fullDescription?: string;
  ingredients?: string;
  skinType?: string;
  usageInstructions?: string;
  gallery?: string[];
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
  logo: string;
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
