// Demo data types - replacing Supabase types

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  dark_mode: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon_code: string | null;
  payment_method: string;
  transaction_id?: string | null;
  payment_screenshot?: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'Pending Verification' | 'Verified' | 'Rejected';
  shipping_address: Address;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  brand: string;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
};

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Rangpur', 'Barisal', 'Comilla',
  'Gazipur', 'Narayanganj', 'Mymensingh', 'Bogra', 'Cox\'s Bazar', 'Jessore', 'Dinajpur',
  'Brahmanbaria', 'Savar', 'Narsingdi', 'Tongi', 'Nawabganj', 'Habiganj', 'Kushtia',
  'Moulvibazar', 'Sunamganj', 'Noakhali', 'Bhola', 'Patuakhali', 'Barguna', 'Jhalokati',
  'Pirojpur', 'Faridpur', 'Gopalganj', 'Madaripur', 'Shariatpur', 'Rajbari', 'Manikganj',
  'Narail', 'Magura', 'Meherpur', 'Chuadanga', 'Jhenaidah', 'Satkhira', 'Bagerhat',
  'Lakshmipur', 'Feni', 'Chandpur', 'Khagrachari', 'Rangamati', 'Bandarban', 'Netrokona',
  'Kishoreganj', 'Sherpur', 'Jamalpur', 'Tangail', 'Naogaon', 'Nawabganj', 'Pabna',
  'Sirajganj', 'Joypurhat', 'Bogra', 'Jaipurhat', 'Lalmonirhat', 'Nilphamari', 'Gaibandha',
  'Kurigram', 'Thakurgaon', 'Panchagarh'
];

// Demo user for local authentication
export const DEMO_USER: Profile = {
  id: 'demo-user-001',
  full_name: 'Demo User',
  email: 'demo@beautydokanbd.com',
  phone: '+880 1700-000000',
  avatar_url: null,
  dark_mode: false,
  email_notifications: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Demo addresses
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
  },
];

// Generate demo orders
function generateDemoOrders(): Order[] {
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];
  const orders: Order[] = [];

  for (let i = 0; i < 8; i++) {
    const subtotal = Math.floor(Math.random() * 3000) + 500;
    const shipping = subtotal >= 1500 ? 0 : 60;
    const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;

    orders.push({
      id: `order-${i + 1}`,
      user_id: 'demo-user-001',
      order_number: `BD${Date.now().toString(36).toUpperCase()}${i}`,
      status: statuses[i % statuses.length],
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
      coupon_code: discount > 0 ? 'SAVE10' : null,
      payment_method: i % 3 === 0 ? 'cod' : i % 3 === 1 ? 'bkash' : 'nagad',
      payment_status: i < 4 ? 'paid' : 'pending',
      shipping_address: DEMO_ADDRESSES[0],
      notes: null,
      created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }

  return orders;
}

export const DEMO_ORDERS: Order[] = generateDemoOrders();

// Demo order items
export function getDemoOrderItems(orderId: string): OrderItem[] {
  const { products } = require('@/lib/data/products');
  const orderItems: OrderItem[] = [];
  const numItems = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numItems; i++) {
    const product = products[i % products.length];
    const quantity = Math.floor(Math.random() * 2) + 1;
    orderItems.push({
      id: `item-${orderId}-${i}`,
      order_id: orderId,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      brand: product.brand,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
      created_at: new Date().toISOString(),
    });
  }

  return orderItems;
}

// Demo customer stats
export const DEMO_CUSTOMER_STATS = {
  total: 1250,
  newThisMonth: 89,
  repeatCustomers: 456,
  averageOrderValue: 1850,
};

// Demo analytics data
export const DEMO_ANALYTICS = {
  today: { orders: 12, revenue: 22500, visitors: 456 },
  thisWeek: { orders: 84, revenue: 155400, visitors: 3200 },
  thisMonth: { orders: 340, revenue: 629000, visitors: 12500 },
  thisYear: { orders: 4080, revenue: 7560000, visitors: 150000 },
};

// Demo admin dashboard stats
export const DEMO_DASHBOARD_STATS = {
  totalOrders: 4080,
  totalRevenue: 7560000,
  totalProducts: 50,
  totalCustomers: 1250,
  pendingOrders: 23,
  processingOrders: 45,
  shippedOrders: 89,
  deliveredOrders: 3920,
};
