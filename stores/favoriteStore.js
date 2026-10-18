
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavoriteStore = create(
  persist(
    (set) => ({
      favoritesByUser: {},

      toggleFavorite: (userId, dish) => {
        if (!userId || !dish?.id) return;

        set((state) => {
          const current = state.favoritesByUser[userId] ?? [];
          const dishId = String(dish.id);

          const exists = current.some(
            (item) =>
              String(typeof item === "object" ? item.id : item) === dishId
          );

          return {
            favoritesByUser: {
              ...state.favoritesByUser,
              [userId]: exists
                ? current.filter(
                    (item) =>
                      String(typeof item === "object" ? item.id : item) !==
                      dishId
                  )
                : [...current, dish],
            },
          };
        });
      },

      clearFavorites: (userId) => {
        if (!userId) return;

        set((state) => ({
          favoritesByUser: {
            ...state.favoritesByUser,
            [userId]: [],
          },
        }));
      },
    }),
    {
      name: "addis-eats-favorites-by-user",
    }
  )
);

export default useFavoriteStore;
