'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '@/lib/data/types';
import { getProducts, updateProduct } from '@/lib/data/products';

interface CartItemWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkoutCart: () => Promise<void>;
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

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const cartData = JSON.parse(savedCart) as Array<{ productId: string; quantity: number }>;
          const products = await getProducts();
          const itemsWithProducts: CartItemWithProduct[] = cartData
            .map((item) => {
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
            .filter((item): item is CartItemWithProduct => Boolean(item));

          setItems(itemsWithProducts);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (!loading) {
      const cartData = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    }
  }, [items, loading]);

  const addItem = async (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
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
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const checkoutCart = async () => {
    try {
      for (const item of items) {
        const newStock = Math.max(0, (item.product.stock ?? 0) - item.quantity);
        await updateProduct(item.product.id, { stock: newStock });
      }
      await clearCart();
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
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
      checkoutCart,
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
  if (context === undefined) {
    return {
      items: [],
      loading: true,
      addItem: async () => {},
      removeItem: async () => {},
      updateQuantity: async () => {},
      clearCart: async () => {},
      checkoutCart: async () => {},
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      total: 0,
    };
  }
  return context;
}
