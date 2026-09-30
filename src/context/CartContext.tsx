"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variation?: string;
  size?: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, variation: string | undefined, size: string | undefined, qty: number) => void;
  removeItem: (productId: string, variation?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("rnb_cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rnb_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.variation === newItem.variation && i.size === newItem.size
      );
      if (existing) {
        const nextQty = existing.quantity + newItem.quantity;
        if (nextQty > existing.stock) {
            // Can't exceed stock
            return prev;
        }
        return prev.map((i) =>
          i === existing ? { ...i, quantity: nextQty } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (productId: string, variation: string | undefined, size: string | undefined, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && i.variation === variation && i.size === size) {
          return { ...i, quantity: Math.min(Math.max(1, qty), i.stock) };
        }
        return i;
      })
    );
  };

  const removeItem = (productId: string, variation?: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variation === variation && i.size === size)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
