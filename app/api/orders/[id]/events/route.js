
import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/session";
import {
  getOrderById,
  finishDeliveryIfDue,
} from "../../../../../lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to track this order." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  if (order.userId !== user.id && user.role !== "admin") {
  return NextResponse.json(
    { error: "You cannot track another customer's order." },
    { status: 403 }
  );
}

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
const encoder = new TextEncoder();
      const send = (event, data) => {
        if (closed) return;

        try {
        controller.enqueue(
  encoder.encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  )
);
        } catch {
          close();
        }
      };

      const close = () => {
        if (closed) return;

        closed = true;
        clearInterval(timer);

        try {
          controller.close();
        } catch {
          // The connection may already be closed.
        }
      };

      const publishOrder = () => {
        if (closed) return;

        const result = finishDeliveryIfDue(id);
        const latestOrder = result.order ?? getOrderById(id);

        if (!latestOrder) {
          send("tracking-error", {
            error: "Order no longer exists.",
          });
          close();
          return;
        }

        send("order-update", {
          id: latestOrder.id,
          status: latestOrder.status,
          neighbourhood: latestOrder.neighbourhood,
          deliveryStartedAt: latestOrder.deliveryStartedAt ?? null,
          deliveredAt: latestOrder.deliveredAt ?? null,
          createdAt: latestOrder.createdAt,
        });

        if (
          latestOrder.status === "Delivered" ||
          latestOrder.status === "Cancelled"
        ) {
          close();
        }
      };

      const timer = setInterval(publishOrder, 1000);

      request.signal.addEventListener("abort", close, {
        once: true,
      });

      send("connected", { connected: true });
      publishOrder();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
