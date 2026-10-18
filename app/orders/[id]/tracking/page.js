import "leaflet/dist/leaflet.css";
import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../../lib/session";
import { getOrderById } from "../../../../lib/orders";
import OrderTrackingClient from "../../../../components/OrderTrackingClient";

export const metadata = {
  title: "Track order | Addis Eats",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({ params }) {
  const user = await getSession();

  if (!user) {
    redirect("/signin");
  }

  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  if (
    order.userId !== user.id &&
    !["admin", "staff"].includes(user.role)
  ) {
    notFound();
  }

  return <OrderTrackingClient initialOrder={order} />;
}
