"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "@/lib/auth-client";

const CartContext = createContext(null);

const GUEST_KEY = "pizzora_cart_guest";

const keyFor = (userId) => (userId ? `pizzora_cart_${userId}` : GUEST_KEY);

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      setHydrated(false);

      try {
        const saved = window.localStorage.getItem(keyFor(userId));

        if (saved) {
          const parsed = JSON.parse(saved);
          setCart(Array.isArray(parsed) ? parsed : []);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to load cart", error);
        setCart([]);
      }

      setHydrated(true);
    };

    loadCart();
  }, [userId]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(keyFor(userId), JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart", error);
    }
  }, [cart, userId, hydrated]);

  const addToCart = (pizza, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === pizza._id);

      if (existing) {
        return prev.map((item) =>
          item._id === pizza._id ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [...prev, { ...pizza, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      subtotal,
      hydrated,
    }),
    [cart, totalItems, subtotal, hydrated]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
