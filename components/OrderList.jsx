import Link from "next/link";
import { PackageOpen } from "lucide-react";
import OrderStatus from "./OrderStatus";

export default function OrderList({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="empty-state">
        <PackageOpen size={36} />
        <h2>No orders yet</h2>
        <p>Your orders will appear here after you check out.</p>
        <Link href="/menu" className="button button-primary">Explore the menu</Link>
      </div>
    );
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div>
            <p className="eyebrow">{order.id}</p>
            <h3>{order.dish}</h3>
            <p className="muted-text">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="order-card-side">
            <strong>ETB {Number(order.total).toLocaleString()}</strong>
            <OrderStatus status={order.status} />
            <Link className="text-link" href={`/orders/${order.id}`}>View details</Link>
          </div>
        </article>
      ))}
    </div>
  );
}