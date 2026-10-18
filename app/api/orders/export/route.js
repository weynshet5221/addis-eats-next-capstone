
import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/session";
import { getOrdersForUser } from "../../../../lib/orders";
import { formatDate } from "../../../../lib/format";

export const dynamic = "force-dynamic";

function escapeCSV(value) {
  let text = String(value ?? "");

  if (/^[\t\r ]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getSession();

  if (!user || user.role !== "customer") {
    return NextResponse.json(
      { error: "Sign in with a customer account to export orders." },
      { status: 401 }
    );
  }

  const orders = getOrdersForUser(user.id);

  const headers = [
    "Order ID",
    "Items",
    "Quantity",
    "Total ETB",
    "Status",
    "Neighbourhood",
    "Created At",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.dish,
    order.quantity,
    Number(order.total || 0).toFixed(2),
    order.status,
    order.neighbourhood,
    formatDate(order.createdAt),
  ]);

  const csv = [
    headers,
    ...rows,
  ]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="addis-eats-order-history.csv"',
      "Cache-Control": "no-store",
    },
  });
}
