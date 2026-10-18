import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "../../../lib/session";
import { getOrderById } from "../../../lib/orders";
import OrderStatus from "../../../components/OrderStatus";
import { cancelOrder } from "../../actions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Order ${id}`, robots: { index: false, follow: false } };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const user = await getSession();

  if (!user) redirect(`/signin?next=${encodeURIComponent(`/orders/${id}`)}`);

  const order = await getOrderById(id);

  if (!order || (order.userId !== user.id && !["admin", "staff"].includes(user.role))) {
    notFound();
  }

  return (
    <main className="page-container narrow-container">
      <Link href="/orders" className="back-link">
        <ArrowLeft size={18} /> Back to my orders
      </Link>

      <div className="order-detail-card">
        <p className="eyebrow">ORDER DETAILS</p>
        <h1>{order.id}</h1>
        <div className="order-detail-status">
          <span>Current status</span>
          <OrderStatus status={order.status} />
        </div>
        <hr />
        <div className="summary-line"><span>Items</span><strong>{order.dish}</strong></div>
        <div className="summary-line"><span>Quantity</span><strong>{order.quantity}</strong></div>
        <div className="summary-line"><span>Total</span><strong>ETB {Number(order.total).toLocaleString()}</strong></div>
        <div className="summary-line"><span>Placed</span><span>{new Date(order.createdAt).toLocaleString()}</span></div>

        {order.status === "Preparing" && (
          <form action={cancelOrder} className="cancel-order-form">
            <input type="hidden" name="orderId" value={order.id} />
            <button className="button button-secondary" type="submit">Cancel order</button>
          </form>
        )}
      </div>
    </main>
  );
}