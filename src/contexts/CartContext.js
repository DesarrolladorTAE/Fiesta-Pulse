"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};

const STORAGE_KEY = "public_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // 🔄 Cargar carrito guardado
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (err) {
      console.error("Error al cargar carrito:", err);
    }
  }, []);

  // 💾 Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Error al guardar carrito:", err);
    }
  }, [items]);

  // ➕ Agregar o incrementar producto
  const add = (item, qty = 1) => {
    setItems((old) => {
      const found = old.find((x) => String(x.id) === String(item.id));
      if (found) {
        return old.map((x) =>
          String(x.id) === String(item.id)
            ? { ...x, qty: (x.qty || 1) + qty }
            : x
        );
      }
      return [...old, { ...item, qty }];
    });
  };

  // ❌ Eliminar producto
  const remove = (id) =>
    setItems((old) => old.filter((x) => String(x.id) !== String(id)));

  // 🔁 Cambiar cantidad
  const setQty = (id, qty) =>
    setItems((old) =>
      old.map((x) =>
        String(x.id) === String(id)
          ? { ...x, qty: Math.max(1, qty) }
          : x
      )
    );

  // 🧹 Vaciar carrito
  const clear = () => setItems([]);

  // 💳 Ir a checkout
  const checkout = (url) => {
    window.location.href = url || "/checkout";
  };

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, checkout }),
    [items]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
