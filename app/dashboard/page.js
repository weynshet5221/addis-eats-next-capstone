import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getAllOrders } from "../../lib/orders";
import RevenueChart from "./RevenueChart.jsx";
import OrdersTrendChart from "./OrdersTrendChart.jsx";
import DashboardAutoRefresh from "./DashboardAutoRefresh";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Analytics Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/admin-login");
  }

  const orders =await getAllOrders();
  const validOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  const totalRevenue = validOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const revenueByNeighbourhood = Object.values(
    validOrders.reduce((groups, order) => {
      const neighbourhood =
        order.neighbourhood || "Not recorded";

      if (!groups[neighbourhood]) {
        groups[neighbourhood] = {
          neighbourhood,
          revenue: 0,
        };
      }

      groups[neighbourhood].revenue += Number(
        order.total || 0
      );

      return groups;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (6 - index));

    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      orders: 0,
    };
  });

  const trendByDate = Object.fromEntries(
    lastSevenDays.map((day) => [
      day.date,
      day,
    ])
  );

  for (const order of validOrders) {
    const date = new Date(order.createdAt)
      .toISOString()
      .slice(0, 10);

    if (trendByDate[date]) {
      trendByDate[date].orders += 1;
    }
  }

  const ordersTrend = lastSevenDays.map((day) => ({
    date: day.label,
    orders: day.orders,
  }));

  return (
    <main className="page-container space-y-8">
      <DashboardAutoRefresh />
      <header className="page-heading">
        <p className="eyebrow">DAY 46 · ANALYTICS</p>
        <h1>Analytics dashboard</h1>
        <p>
          Review revenue by neighbourhood and order activity over
          the last seven days.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-600">
            Recorded orders
          </p>
          <p className="mt-2 text-3xl font-bold">
            {orders.length}
          </p>
        </article>

        <article className="rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-600">
            Revenue excluding cancelled orders
          </p>
          <p className="mt-2 text-3xl font-bold">
            {new Intl.NumberFormat("en-ET", {
              style: "currency",
              currency: "ETB",
              maximumFractionDigits: 0,
            }).format(totalRevenue)}
          </p>
        </article>
      </section>

      <RevenueChart data={revenueByNeighbourhood} />

      <OrdersTrendChart data={ordersTrend} />
    </main>
  );
}