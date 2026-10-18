"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useCartStore } from "../stores/cartStore";

export default function AddToCartButton({ dish }) {
  const addItem = useCartStore((state) => state.addItem);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  function handleAddToCart() {
    addItem(dish);
    setMessage(true);
  }

  return (
    <div>
      {message && (
        <p
          role="status"
          aria-live="polite"
          style={{
            color: "#16803d",
            fontSize: "14px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <CheckCircle size={16} aria-hidden="true" />
          {dish.name} added to cart!
        </p>
      )}

      <button
        type="button"
        className="button button-primary"
        onClick={handleAddToCart}
      >
        <ShoppingCart size={17} aria-hidden="true" />
        Add to cart
      </button>
    </div>
  );
}