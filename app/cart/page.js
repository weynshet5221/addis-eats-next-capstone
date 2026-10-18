
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "../../stores/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="page-container cart-page">
      <header className="page-heading">
        <p className="eyebrow">ALMOST YOURS</p>
        <h1>Your cart</h1>
      </header>

      {!items.length ? (
        <section className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={34} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Discover your favorite dishes and add something delicious.</p>
          <Link href="/menu" className="button button-primary">
            Explore the menu <ArrowRight size={18} />
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            <div className="cart-section-heading">
              <h2>Your items</h2>
              <span>{itemCount} items</span>
            </div>

            {items.map((item) => {
              const imageSrc =
                typeof item.image === "string" && item.image
                  ? item.image.startsWith("/")
                    ? item.image
                    : `/${item.image}`
                  : "/images/main.png";

              return (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      sizes="100px"
                    />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>ETB {Number(item.price || 0).toLocaleString()} each</p>

                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label={`Reduce ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <strong>
                      ETB{" "}
                      {(
                        Number(item.price || 0) * item.quantity
                      ).toLocaleString()}
                    </strong>

                    <button
                      className="cart-remove-button"
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={17} />
                      <span>Remove</span>
                    </button>
                  </div>
                </article>
              );
            })}

            <Link href="/menu" className="text-link cart-back-link">
              ← Continue shopping
            </Link>
          </section>

          <aside className="summary-card">
            <p className="eyebrow">YOUR ORDER</p>
            <h2>Order summary</h2>

            <div className="summary-line">
              <span>Items ({itemCount})</span>
              <span>ETB {total.toLocaleString()}</span>
            </div>

            <div className="summary-line summary-total">
              <span>Total</span>
              <strong>ETB {total.toLocaleString()}</strong>
            </div>

            <Link
              href="/checkout"
              className="button button-primary button-full cart-checkout-button"
            >
              Continue to checkout <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
