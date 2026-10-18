
const orders =
  globalThis.__addisEatsOrders ??
  (globalThis.__addisEatsOrders = [
    {
      id: "ORD-1001",
      userId: "user-1",
      dish: "Kitfo",
      quantity: 2,
      total: 2000,
      status: "Preparing",
      neighbourhood: "Bole",
      createdAt: "2026-10-10T06:00:00.000Z",
    },
    {
      id: "ORD-1002",
      userId: "user-2",
      dish: "Doro Wat",
      quantity: 1,
      total: 350,
      status: "Delivered",
      neighbourhood: "Arada",
      createdAt: "2026-10-10T06:10:00.000Z",
    },
  ]);

const allowedStatuses = [
  "Preparing",
  "Ready",
  "Delivering",
  "Delivered",
  "Cancelled",
];

export const DELIVERY_DURATION_MS = 18_000;

export function getOrdersForUser(userId) {
  return orders
    .filter((order) => order.userId === userId)
    .map((order) => ({ ...order }));
}

export function getAllOrders() {
  return orders.map((order) => ({ ...order }));
}

export function getOrderById(orderId) {
  const order = orders.find(
    (item) => item.id === String(orderId)
  );

  return order ? { ...order } : null;
}

export function createOrderForUser({
  userId,
  items,
  neighbourhood = "Not recorded",
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      error: "Your cart is empty.",
    };
  }

  const validItems = items.every(
    (item) =>
      Number.isInteger(item.quantity) &&
      item.quantity >= 1 &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) >= 0
  );

  if (!validItems) {
    return {
      success: false,
      error: "One or more order items are invalid.",
    };
  }

  const quantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const dish = items
    .map((item) => `${item.name} × ${item.quantity}`)
    .join(", ");

  const order = {
    id: `ORD-${Date.now()}`,
    userId,
    dish,
    quantity,
    total,
    status: "Preparing",
    neighbourhood,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);

  return {
    success: true,
    order: { ...order },
  };
}

export function cancelOrderForUser(orderId, userId) {
  const order = orders.find(
    (item) => item.id === String(orderId)
  );

  if (!order) {
    return {
      success: false,
      error: "Order not found.",
    };
  }

  if (order.userId !== userId) {
    return {
      success: false,
      error: "You cannot cancel another user's order.",
    };
  }

  if (order.status !== "Preparing") {
    return {
      success: false,
      error: "Only preparing orders can be cancelled.",
    };
  }

  order.status = "Cancelled";
  order.cancelledAt = new Date().toISOString();

  return { success: true, order: { ...order } };
}

export function updateOrderStatus(orderId, status) {
  if (!allowedStatuses.includes(status)) {
    return {
      success: false,
      error: "Invalid order status.",
    };
  }

  const order = orders.find(
    (item) => item.id === String(orderId)
  );

  if (!order) {
    return {
      success: false,
      error: "Order not found.",
    };
  }
if (order.status === status) {
  return { success: true, order: { ...order } };
}
  if (order.status === "Delivered" || order.status === "Cancelled") {
    return {
      success: false,
      error: "This order is already finished.",
    };
  }

  if (status === "Delivering" && order.status !== "Delivering") {
    order.deliveryStartedAt = new Date().toISOString();
    delete order.deliveredAt;
  }

  if (status === "Delivered") {
    order.deliveredAt = new Date().toISOString();
  }

  if (status !== "Delivering") {
    delete order.deliveryStartedAt;
  }

  order.status = status;

  return { success: true, order: { ...order } };
}

export function finishDeliveryIfDue(orderId) {
  const order = orders.find(
    (item) => item.id === String(orderId)
  );

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  if (order.status !== "Delivering") {
    return { success: true, order: { ...order } };
  }

  const startedAt = new Date(order.deliveryStartedAt).getTime();

  if (!Number.isFinite(startedAt)) {
    order.deliveryStartedAt = new Date().toISOString();

    return { success: true, order: { ...order } };
  }

  if (Date.now() - startedAt >= DELIVERY_DURATION_MS) {
    order.status = "Delivered";
    order.deliveredAt = new Date().toISOString();
  }

  return { success: true, order: { ...order } };
}
