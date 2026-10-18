
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, MapPin } from "lucide-react";
import { getSession } from "../../lib/session";
import { getOrdersForUser } from "../../lib/orders";
import { formatDate, formatETB } from "../../lib/format";
import OrderTable from "./OrderTable";

export const metadata = {
  title: "My orders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 5;

const ALLOWED_SORTS = [
  "id",
  "dish",
  "neighbourhood",
  "total",
  "status",
  "createdAt",
];

function compareOrders(a, b, sort) {
  if (sort === "total") {
    return Number(a.total || 0) - Number(b.total || 0);
  }

  if (sort === "createdAt") {
    return (
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
    );
  }

  return String(a[sort] || "").localeCompare(
    String(b[sort] || ""),
    undefined,
    { sensitivity: "base" }
  );
}

export default async function OrdersPage({ searchParams }) {
  const user = await getSession();

  if (!user) {
    redirect("/signin?next=%2Forders");
  }

  const params = await searchParams;

  const requestedPage = Number(params.page || 1);
  const pageNumber =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const sort = ALLOWED_SORTS.includes(params.sort)
    ? params.sort
    : "createdAt";

  const dir = params.dir === "asc" ? "asc" : "desc";
  const orders = getOrdersForUser(user.id);

  const sortedOrders = [...orders].sort((a, b) => {
    const result = compareOrders(a, b, sort);
    return dir === "asc" ? result : -result;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / PAGE_SIZE)
  );

  const page = Math.min(pageNumber, totalPages);
  const start = (page - 1) * PAGE_SIZE;

  const pageOrders = sortedOrders.slice(
    start,
    start + PAGE_SIZE
  );

  return (
    <main className="page-container">
      <header className="page-heading">
        <h1>My orders</h1>

       <Link href="/api/orders/export">
       <div className="export">
  <Download size={16} />
  Export CSV</div>
</Link>
      </header>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Your orders will appear here after you check out.</p>
          <Link href="/menu" className="button button-primary">
            Explore the menu
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-600">

            {Math.min(start + PAGE_SIZE, sortedOrders.length)} of{" "}
            {sortedOrders.length} orders
          </p>

          <OrderTable
            orders={pageOrders}
            sort={sort}
            dir={dir}
          />

          <section className="order-tracking-list" aria-labelledby="tracking-list-title">
            <div className="tracking-list-heading">
              <div>
                <p className="eyebrow">DELIVERY UPDATES</p>
                <h2 id="tracking-list-title">Track your orders</h2>
              </div>
            </div>

            {pageOrders.map((order) => (
              <article className="order-tracking-row" key={order.id}>
                <div>
                  <strong>{order.id}</strong>
                  <p>{order.dish}</p>
                  <p>
                    {order.neighbourhood} · {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="order-tracking-row-side">
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <strong>{formatETB(order.total)}</strong>
                  <Link
                    href={`/orders/${encodeURIComponent(order.id)}/tracking`}
                    className="button button-primary"
                  >
                    <MapPin size={16} />
                    Track order
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {totalPages > 1 && (
            <nav
              aria-label="Order history pages"
              className="mt-6 flex items-center justify-between gap-4"
            >
              {page > 1 ? (
                <Link
                  className="button"
                  href={`/orders?page=${page - 1}&sort=${sort}&dir=${dir}`}
                >
                  Previous
                </Link>
              ) : (
                <span />
              )}

              <p aria-live="polite">
                Page {page} of {totalPages}
              </p>

              {page < totalPages ? (
                <Link
                  className="button button-primary"
                  href={`/orders?page=${page + 1}&sort=${sort}&dir=${dir}`}
                >
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </main>
  );
}
