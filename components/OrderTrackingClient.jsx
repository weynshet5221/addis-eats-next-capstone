
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Radio,
  Truck,
} from "lucide-react";
import TrackingMapLoader from "./TrackingMapLoader";
import { formatDate, formatRelativeTime } from "../lib/format";

const DELIVERY_MS = 18_000;
const steps = ["Preparing", "Ready", "Delivering", "Delivered"];

export default function OrderTrackingClient({ initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [now, setNow] = useState(0);
  const [connection, setConnection] = useState("Connecting");

  const isDelivering = order.status === "Delivering";
  const delivered = order.status === "Delivered";
  const cancelled = order.status === "Cancelled";

  useEffect(() => {
    const source = new EventSource(
      `/api/orders/${encodeURIComponent(initialOrder.id)}/events`
    );

    source.addEventListener("connected", () => {
      setConnection("Live updates connected");
    });

    source.addEventListener("order-update", (event) => {
      const update = JSON.parse(event.data);

      setOrder((current) => ({ ...current, ...update }));

      if (update.status === "Delivered" || update.status === "Cancelled") {
        source.close();
        setConnection("Tracking complete");
      } else {
        setConnection("Live updates connected");
      }
    });

    source.addEventListener("tracking-error", () => {
      setConnection("Tracking unavailable");
      source.close();
    });

    source.onerror = () => {
      setConnection("Reconnecting to live updates");
    };

    return () => source.close();
  }, [initialOrder.id]);

  useEffect(() => {
    if (!isDelivering || !order.deliveryStartedAt) return;

    const timer = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(timer);
  }, [isDelivering, order.deliveryStartedAt]);

  const startedAt = order.deliveryStartedAt
    ? new Date(order.deliveryStartedAt).getTime()
    : NaN;

  const progress = delivered
    ? 1
    : isDelivering && Number.isFinite(startedAt) && now > 0
      ? Math.max(0, Math.min(1, (now - startedAt) / DELIVERY_MS))
      : 0;

  const currentStep = steps.indexOf(order.status);

  return (
    <main className="tracking-page">
      <header className="tracking-heading">
        <Link href="/orders" className="tracking-back-link">
          ← Back to my orders
        </Link>
        <p className="eyebrow">DELIVERY TRACKING</p>
        <h1>Track your order</h1>
        <p>Order <strong>{order.id}</strong></p>
      </header>

      <section className="tracking-status-card" aria-live="polite">
       <div className="tracking-status-icon">
  {delivered ? (
    <CheckCircle2 size={28} />
  ) : cancelled ? (
    <Clock3 size={28} />
  ) : isDelivering ? (
    <Truck size={28} />
  ) : (
    <Clock3 size={28} />
  )}
</div>
        <div>
          <p className="tracking-status-label">Current status</p>
          <h2>{order.status}</h2>
          <p>
            {cancelled
              ? "This order has been cancelled."
              : delivered
                ? "Your order has reached its simulated destination."
                : isDelivering
                  ? "Your courier is moving toward the delivery destination."
                  : "We will show the delivery journey when the order is marked Delivering."}
          </p>
        </div>
      </section>

      <section className="tracking-progress-card">
        <h2>Order progress</h2>
        <ol className="tracking-steps">
          {steps.map((step, index) => {
            const complete = !cancelled && (delivered || index < currentStep);
            const active = !cancelled && !delivered && index === currentStep;

            return (
              <li
                key={step}
                className={[
                  "tracking-step",
                  complete ? "is-complete" : "",
                  active ? "is-active" : "",
                ].filter(Boolean).join(" ")}
              >
                <span className="tracking-step-indicator">
                  {complete ? <CheckCircle2 size={18} /> : index + 1}
                </span>
                <span>{step}</span>
              </li>
            );
          })}
        </ol>

        {isDelivering && (
          <div className="tracking-progress-detail">
            <div className="tracking-progress-label">
              <span>Simulated journey</span>
              <strong>{Math.round(progress * 100)}%</strong>
            </div>
            <div
              className="tracking-progress-track"
              role="progressbar"
              aria-label="Simulated delivery progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <span style={{ width: `${progress * 100}%` }} />
            </div>
            <p>The courier animation takes approximately 18 seconds.</p>
          </div>
        )}

        <p className="tracking-connection">
          <Radio size={16} aria-hidden="true" />
          <span>{connection}</span>
        </p>
      </section>

      <section className="tracking-map-card">
        <div className="tracking-section-heading">
          <div>
            <p className="eyebrow">DELIVERY ROUTE</p>
            <h2>Courier location</h2>
          </div>
          <span className="tracking-neighbourhood">
            <MapPin size={16} />
            {order.neighbourhood}
          </span>
        </div>

        <TrackingMapLoader
          neighbourhood={order.neighbourhood}
          progress={progress}
          status={order.status}
        />

        <p className="tracking-map-note">
          Demonstration only: the courier position, route and destination
          are simulated. This map does not use live GPS or a verified
          delivery address.
        </p>
        <ul className="tracking-map-legend">
          <li><span className="legend-dot restaurant-dot" /> Restaurant</li>
          <li><span className="legend-dot courier-dot" /> Courier</li>
          <li><span className="legend-dot destination-dot" /> Destination</li>
        </ul>
      </section>

      <section className="tracking-order-card">
        <h2>Order details</h2>
        <dl>
          <div><dt>Items</dt><dd>{order.dish}</dd></div>
          <div><dt>Quantity</dt><dd>{order.quantity}</dd></div>
          <div>
            <dt>Total</dt>
            <dd>ETB {Number(order.total || 0).toLocaleString()}</dd>
          </div>
          <div>
            <dt>Order placed</dt>
            <dd>
              {formatDate(order.createdAt)}
              <span className="tracking-relative-time">
                {" "}({formatRelativeTime(order.createdAt)})
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <Link href="/orders" className="button button-primary">
        Return to my orders
      </Link>
    </main>
  );
}
