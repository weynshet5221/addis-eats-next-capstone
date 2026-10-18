"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../stores/cartStore";
import { NEIGHBOURHOODS } from "../../lib/neighbourhoods";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [neighbourhood, setNeighbourhood] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * item.quantity,
    0
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!neighbourhood) {
      setError("Please select your neighbourhood.");
      return;
    }

    setSubmitting(true);

    try {
      console.log("Checkout submitted", {
  items,
  neighbourhood,
});
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          neighbourhood,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();
console.log("Order API response:", response.status, result);
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin?next=%2Fcheckout");
          return;
        }

        throw new Error(
          result.error || "Unable to place your order."
        );
      }

     clearCart();
router.push("/orders");
router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-container">
      <header className="page-heading">
        <h1>Checkout</h1>
      </header>

      {!items.length ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <Link href="/menu" className="button button-primary">
            Explore the menu
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Order confirmation</h2>
            <div className="form-field">
              <label htmlFor="neighbourhood">
                Delivery location
              </label>

              <select
                id="neighbourhood"
                name="neighbourhood"
                value={neighbourhood}
                onChange={(event) =>
                  setNeighbourhood(event.target.value)
                }
                required
              >
                <option value="">Select neighbourhood</option>
                {NEIGHBOURHOODS.map((name) => (
                  <option value={name} key={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="button button-primary button-full"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>

            <Link href="/cart" className="text-link">
              Return to cart
            </Link>
          </form>

          <aside className="summary-card">
            <h2>Order summary</h2>

            {items.map((item) => (
              <div className="summary-line" key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ETB{" "}
                  {(
                    Number(item.price || 0) * item.quantity
                  ).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="summary-line summary-total">
              <strong>Total</strong>
              <strong>ETB {total.toLocaleString()}</strong>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}