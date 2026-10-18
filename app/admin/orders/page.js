import { ClipboardList } from "lucide-react";
import { getSession } from "../../../lib/session";
import { getAllOrders } from "../../../lib/orders";
import { redirect } from "next/navigation";
import { setAdminOrderStatus } from "../../actions";

export const metadata = {
  title: "Manage Orders",
};

export default async function AdminOrdersPage() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/admin-login");
  }
const orders = getAllOrders();

  return (
    <section className="admin-orders-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Orders</h1>
          <p>View customer orders and update their status.</p>
        </div>
      </div>

      <div className="admin-menu-count">
        <ClipboardList size={20} />
        <span>{orders.length} total orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <h2>No orders yet</h2>
          <p>
            Customer orders will appear here when available.
          </p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <article className="admin-order-card" key={order.id}>
              <div className="admin-order-heading">
                <div>
                  <p className="admin-order-id">{order.id}</p>
                  <h2>{order.dish}</h2>
                </div>

                <span
                  className={`order-status ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="admin-order-details">
                <p>
                  <strong>Customer ID:</strong> {order.userId}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  ETB {Number(order.total).toLocaleString()}
                </p>
                <p>
                  <strong>Placed:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <form
                action={setAdminOrderStatus}
                className="admin-order-status-form"
              >
                <input
                  type="hidden"
                  name="orderId"
                  value={order.id}
                />

                <label htmlFor={`status-${order.id}`}>
                  Update status
                </label>

                <select
                  id={`status-${order.id}`}
                  name="status"
                  defaultValue={order.status}
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivering">Delivering</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="button button-primary"
                  type="submit"
                >
                  Save status
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}