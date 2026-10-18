
"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import useFavoriteStore from "../stores/favoriteStore";

const EMPTY_FAVORITES = [];

export default function FavoriteButton({ dish, userId }) {
  const router = useRouter();
  const pathname = usePathname();

  const favorites = useFavoriteStore(
    (state) =>
      (userId && state.favoritesByUser?.[userId]) ||
      EMPTY_FAVORITES
  );

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite
  );

  const isFavorite = favorites.some(
    (item) =>
      String(typeof item === "object" ? item.id : item) ===
      String(dish.id)
  );

  function handleFavoriteClick() {
    if (!userId) {
      router.push(
        `/signin?next=${encodeURIComponent(pathname || "/menu")}`
      );
      return;
    }

    toggleFavorite(userId, dish);
  }

  return (
    <button
      type="button"
      className={`favorite-button${isFavorite ? " active" : ""}`}
      onClick={handleFavoriteClick}
      aria-label={
        isFavorite
          ? `Remove ${dish.name} from favorites`
          : `Add ${dish.name} to favorites`
      }
      aria-pressed={isFavorite}
    >
      <Heart
        size={21}
        strokeWidth={2}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}
