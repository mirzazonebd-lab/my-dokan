'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { CartItem, Address } from '@/lib/demo-data';
import { Product } from '@/lib/data/types';

interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_COST = 60;
const CART_STORAGE_KEY = 'beautydokanbd_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic import for products
  const getProducts = useCallback(async () => {
    const { products } = await import('@/lib/data/products');
    return products;
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          const products = await getProducts();
          const itemsWithProducts: CartItemWithProduct[] = cartData
            .map((item: { productId: string; quantity: number }) => {
              const product = products.find((p: Product) => p.id === item.productId);
              if (!product) return null;
              return {
                id: item.productId,
                user_id: 'guest',
                product_id: item.productId,
                quantity: item.quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product,
              };
            })
            .filter(Boolean) as CartItemWithProduct[];

          setItems(itemsWithProducts);
        }
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      setLoading(false);
    };

    loadCart();
  }, [getProducts]);

  

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!loading) {
      const cartData = items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    }
  }, [items, loading]);

  const addItem = async (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product_id === product.id);

      if (existing) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItemWithProduct = {
        id: product.id,
        user_id: 'guest',
        product_id: product.id,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product,
      };

      return [...prev, newItem];
    });
  };

  const removeItem = async (productId: string) => {
    setItems(prev => prev.filter(item => item.product_id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      shipping,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  // During SSR, context will be undefined - return a default safe state
  if (context === undefined) {
    return {
      items: [],
      loading: true,
      addItem: async () => {},
      removeItem: async () => {},
      updateQuantity: async () => {},
      clearCart: async () => {},
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      total: 0,
    };
  }
  return context;
}
