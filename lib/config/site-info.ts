/**
 * Centralized site configuration
 * All site-wide constants and settings are defined here
 * Update values in one place to change them everywhere
 */

export const SITE_INFO = {
  // Company Info
  name: 'Beauty Dokan BD',
  description: "Bangladesh's trusted destination for authentic Korean skincare and global beauty brands.",
  email: 'info@beautydokan.com',
  phone: '+8809638758429',
  phone2: '01712-012737', // Alternative phone (if needed)
  location: 'Dhaka, Bangladesh',

  // Delivery & Shipping
  deliveryInfo: {
    freeDeliveryThreshold: 1500, // Free delivery on orders over ৳1500
    freeDeliveryText: 'Free delivery on orders over ৳1500',
    deliveryDistricts: 64,
    deliveryDistrictsText: 'Delivering to all 64 districts',
    dhakaDelivery: '1-2 days',
    outsideDhakaDelivery: '3-5 days',
    shippingText: 'Fast shipping - Dhaka 1-2 days, Outside 3-5 days',
  },

  // Customer Reviews & Ratings
  reviews: {
    rating: 4.8,
    ratingText: '4.8/5',
    totalReviews: 19000,
    reviewsText: 'Rated 4.8/5 by 19,000+ happy customers',
  },

  // Social Media
  social: {
    facebook: 'https://facebook.com/beautydokanbd',
    instagram: 'https://instagram.com/beautydokanbd',
    whatsapp: '+8809638758429',
    youtube: 'https://youtube.com/beautydokanbd',
  },

  // Payment Methods
  paymentMethods: ['bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Card', 'Cash on Delivery'],
  paymentMethodsText: 'bKash, Nagad, Rocket, Bank or Cash on Delivery',

  // Featured Brands
  featuredBrands: ['COSRX', 'Laneige', 'Some By Mi', 'Innisfree', 'Klairs'],

  // Special Offers
  specialOffers: {
    flashSaleDiscount: '45%',
    specialPromotion: 'Buy 3 Get 1 Free Special Gift for 7 Days',
  },

  // Announcements (for ticker)
  announcements: [
    '🌸 Free delivery on orders over ৳1500',
    '⚡ Flash Sale — up to 45% OFF on K-Beauty',
    '✨ New arrivals from COSRX, Laneige & Klairs',
    '🇰🇷 Authentic Korean skincare imported directly',
    '💳 Pay with bKash, Nagad, Rocket, Bank or Cash on Delivery',
    '🚚 Delivering to all 64 districts of Bangladesh',
    '⭐ Rated 4.8/5 by 19,000+ happy customers',
    '🎁 Buy 3 Get 1 Free Special Gift for 7 Days',
  ],

  // Copyright
  copyrightYear: new Date().getFullYear(),
};

// Export individual sections for convenience
export const DELIVERY = SITE_INFO.deliveryInfo;
export const REVIEWS = SITE_INFO.reviews;
export const SOCIAL = SITE_INFO.social;
export const PAYMENTS = SITE_INFO.paymentMethods;
export const ANNOUNCEMENTS = SITE_INFO.announcements;
