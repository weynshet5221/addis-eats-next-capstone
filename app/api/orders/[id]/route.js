import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/session";
import { getOrderById } from "../../../../lib/orders";

export async function GET(request, { params }) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { id } = await params;
const order = await getOrderById(id);
  if (!order || (order.userId !== user.id && !["admin", "staff"].includes(user.role))) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order }, {
    headers: { "Cache-Control": "no-store" },
  });
}