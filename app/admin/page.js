import Link from "next/link";
import {
  ClipboardList,
  UtensilsCrossed,
  Banknote,
  ArrowUpRight,
  ChartColumn,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getAllOrders } from "../../lib/orders";
import { getDishes } from "../../lib/dishes";

export const metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/admin-login");
  }

  const [orders, dishes] = await Promise.all([
    Promise.resolve(getAllOrders()),
    getDishes(),
  ]);

  const activeOrders = orders.filter(
    (order) =>
      !["Cancelled", "Completed", "Delivered"].includes(
        order.status
      )
  );

  const revenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

  const stats = [
    {
      label: "Total orders",
      value: orders.length,
      icon: ClipboardList,
      description: "All recorded orders",
    },
    {
      label: "Active orders",
      value: activeOrders.length,
      icon: UtensilsCrossed,
      description: "Orders still in progress",
    },
    {
      label: "Menu dishes",
      value: dishes.length,
      icon: Banknote,
      description: "Dishes in the menu",
    },
  ];

  return (
    <main className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good to see you, {user.name || "Admin"}</h1>
        </div>

        <Link href="/admin/orders" className="primary-button">
          View orders <ArrowUpRight size={18} />
        </Link>
      </div>

      <section className="admin-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="admin-stat-card" key={stat.label}>
              <div className="admin-stat-top">
                <span>{stat.label}</span>
                <span className="admin-stat-icon">
                  <Icon size={21} />
                </span>
              </div>

              <strong>{stat.value}</strong>
              <p>{stat.description}</p>
            </article>
          );
        })}
      </section>

      <section className="admin-revenue-card">
        <div>
          <p>Total revenue from non-cancelled orders</p>
          <h2>ETB {revenue.toLocaleString()}</h2>
        </div>
        <Banknote size={36} />
      </section>

      <section className="admin-quick-actions">
        <h2>Quick actions</h2>

        <div className="admin-action-grid">
          <Link href="/admin/orders" className="admin-action-card">
            <ClipboardList size={24} />
            <strong>Manage orders</strong>
            <ArrowUpRight size={18} />
          </Link>

          <Link href="/admin/menu" className="admin-action-card">
            <UtensilsCrossed size={24} />
            <strong>Manage menu</strong>
            <ArrowUpRight size={18} />
          </Link>

<Link href="/dashboard" className="admin-action-card">
  <strong>Analytics Dashboard</strong>
</Link>
        </div>
      </section>
    </main>
  );
}