
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import useFavoriteStore from "../stores/favoriteStore";
import DishCard from "./DishCard";

const EMPTY_FAVORITES = [];

export default function FavoritesContent({ userId }) {
  const favorites = useFavoriteStore(
    (state) =>
      (userId && state.favoritesByUser?.[userId]) ||
      EMPTY_FAVORITES
  );

  return (
    <main className="page-container">
      <header className="page-heading">
        <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>Favorite dishes</h1>
        <p>Keep the meals you love close at hand.</p>
      </header>

      {favorites.length > 0 ? (
        <div className="dish-grid">
          {favorites.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              canOrder
              userId={userId}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={38} />
          <h2>No favorites yet</h2>
          <p>Use the heart icon on any dish to save it here.</p>
          <Link href="/menu" className="button button-primary">
            Browse menu
          </Link>
        </div>
      )}
    </main>
  );
}
