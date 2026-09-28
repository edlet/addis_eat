"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside Providers");
  return cart;
}

export default function Providers({ children }) {
  // Keep the initial server and browser renders identical. Load persisted
  // cart data after hydration so it cannot cause a markup mismatch.
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("addis-eats-cart");
      if (saved) setItems(JSON.parse(saved));
      const savedFavorites = window.localStorage.getItem("addis-eats-favorites");
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch {
      // Treat invalid or unavailable stored data as an empty cart.
    } finally {
      setHasLoadedStoredCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) return;
    window.localStorage.setItem("addis-eats-cart", JSON.stringify(items));
    window.localStorage.setItem("addis-eats-favorites", JSON.stringify(favorites));
    const cookieItems = items.map(({ id, quantity }) => ({ id, quantity }));
    document.cookie = `addis-eats-cart=${encodeURIComponent(JSON.stringify(cookieItems))}; Path=/; Max-Age=604800; SameSite=Lax`;
  }, [hasLoadedStoredCart, items, favorites]);

  const toggleFavorite = useCallback((dish) => {
    setFavorites((current) => current.some((item) => item.id === dish.id)
      ? current.filter((item) => item.id !== dish.id)
      : [...current, dish]);
  }, []);

  const addItem = useCallback((dish) => {
    setItems((current) => {
      const found = current.find((item) => item.id === dish.id);
      return found
        ? current.map((item) => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...dish, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    favorites,
    toggleFavorite,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items, favorites, toggleFavorite, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
