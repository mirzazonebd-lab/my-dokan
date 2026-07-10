export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  totalReviews: number;
  stockStatus: string;
  badge?: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string;
  skinType: string;
  usageInstructions: string;
  image: string;
  gallery: string[];
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  icon: string;
}
