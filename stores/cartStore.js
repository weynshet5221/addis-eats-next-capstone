"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dish) =>
        set((state) => {
          const existing = state.items.find((item) => String(item.id) === String(dish.id));

          if (existing) {
            return {
              items: state.items.map((item) =>
                String(item.id) === String(dish.id)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...dish, quantity: 1 }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => String(item.id) !== String(id)),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity < 1
            ? state.items.filter((item) => String(item.id) !== String(id))
            : state.items.map((item) =>
                String(item.id) === String(id) ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotal: () =>
        get().items.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0),
    }),
    {
      name: "addiseats_cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);