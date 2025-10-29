"use client";
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const CART_KEY = "fp_cart_v1";
const CUSTOMER_KEY = "fp_checkout_customer_v1";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const router = useRouter();

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // Guardar en localStorage (debounce simple)
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items || []));
      } catch {}
    }, 80);
    return () => clearTimeout(id);
  }, [items]);

  const add = useCallback((product, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i >= 0) {
        const clone = [...prev];
        clone[i] = { ...clone[i], qty: (clone[i].qty || 1) + qty };
        return clone;
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems(prev => prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const checkout = useCallback((to = "/checkout") => {
    router.push(to);
  }, [router]);

  const count = useMemo(() => (items || []).reduce((a, b) => a + (b.qty || 1), 0), [items]);
  const total = useMemo(() => (items || []).reduce((a, b) => a + Number(b.price || 0) * (b.qty || 1), 0), [items]);

  // Helper para guardar/leer datos del cliente (Checkout form)
  const saveCustomer = useCallback((customer) => {
    try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer)); } catch {}
  }, []);
  const loadCustomer = useCallback(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  const value = { items, add, remove, setQty, clear, checkout, count, total, saveCustomer, loadCustomer };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
