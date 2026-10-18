const statusClasses = {
  Preparing: "preparing",
  Ready: "ready",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

export default function OrderStatus({ status }) {
  return (
    <span className={`order-status ${statusClasses[status] || ""}`}>
      {status}
    </span>
  );
}