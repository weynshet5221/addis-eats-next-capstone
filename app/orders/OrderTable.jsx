import Link from "next/link";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) =>
  new Date(value).toLocaleString("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Addis_Ababa",
  });

const columns = [
  { key: "id", label: "Order ID" },
  { key: "dish", label: "Items" },
  { key: "neighbourhood", label: "Neighbourhood" },
  { key: "total", label: "Total (ETB)" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Date" },
];

export default function OrderTable({
  orders = [],
  sort = "createdAt",
  dir = "desc",
}) {
  function sortHref(key) {
    const nextDir =
      sort === key && dir === "asc" ? "desc" : "asc";

    return `/orders?sort=${key}&dir=${nextDir}`;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="p-3 text-left text-gray-600">
          Your orders. Select a column heading to sort the table.
        </caption>

        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column) => {
              const active = sort === column.key;

              const ariaSort = active
                ? dir === "asc"
                  ? "ascending"
                  : "descending"
                : "none";

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className="whitespace-nowrap px-4 py-3 font-semibold"
                >
                  <Link
                    href={sortHref(column.key)}
                    className="underline-offset-4 hover:underline"
                  >
                    {column.label}
                    {active
                      ? dir === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <th
                scope="row"
                className="whitespace-nowrap px-4 py-3 font-medium"
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="underline underline-offset-4"
                >
                  {order.id}
                </Link>
              </th>

              <td className="px-4 py-3">{order.dish}</td>

              <td className="px-4 py-3">
                {order.neighbourhood || "Not recorded"}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                {formatETB(order.total)}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`order-status ${String(
                    order.status
                  ).toLowerCase()}`}
                >
                  {order.status}
                </span>
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}