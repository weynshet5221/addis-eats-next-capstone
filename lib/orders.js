
import { randomUUID } from "node:crypto";
import { redis } from "./redis";

const ORDER_IDS_KEY = "addis-eats:orders:ids";
const orderKey = (id) => `addis-eats:orders:${id}`;

const allowedStatuses = [
  "Preparing",
  "Ready",
  "Delivering",
  "Delivered",
  "Cancelled",
];

export const DELIVERY_DURATION_MS = 18_000;

export async function getAllOrders() {
  const ids = await redis.smembers(ORDER_IDS_KEY);

  if (!ids.length) return [];

  const orders = await Promise.all(
    ids.map((id) => redis.get(orderKey(id)))
  );

  return orders
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

export async function getOrdersForUser(userId) {
  const orders = await getAllOrders();
  return orders.filter((order) => order.userId === userId);
}

export async function getOrderById(orderId) {
  return await redis.get(orderKey(String(orderId)));
}

export async function createOrderForUser({
  userId,
  items,
  neighbourhood = "Not recorded",
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
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
    id: `ORD-${randomUUID()}`,
    userId,
    dish,
    quantity,
    total,
    status: "Preparing",
    neighbourhood,
    createdAt: new Date().toISOString(),
  };

  await redis.set(orderKey(order.id), order);
  await redis.sadd(ORDER_IDS_KEY, order.id);

  return { success: true, order };
}

export async function cancelOrderForUser(orderId, userId) {
  const order = await getOrderById(orderId);

  if (!order) {
    return { success: false, error: "Order not found." };
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

  const updatedOrder = {
    ...order,
    status: "Cancelled",
    cancelledAt: new Date().toISOString(),
  };

  await redis.set(orderKey(order.id), updatedOrder);

  return { success: true, order: updatedOrder };
}

export async function updateOrderStatus(orderId, status) {
  if (!allowedStatuses.includes(status)) {
    return { success: false, error: "Invalid order status." };
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  if (order.status === status) {
    return { success: true, order };
  }

  if (["Delivered", "Cancelled"].includes(order.status)) {
    return {
      success: false,
      error: "This order is already finished.",
    };
  }

  const updatedOrder = { ...order };

  if (status === "Delivering") {
    updatedOrder.deliveryStartedAt = new Date().toISOString();
    delete updatedOrder.deliveredAt;
  }

  if (status === "Delivered") {
    updatedOrder.deliveredAt = new Date().toISOString();
  }

  if (status !== "Delivering") {
    delete updatedOrder.deliveryStartedAt;
  }

  updatedOrder.status = status;

  await redis.set(orderKey(updatedOrder.id), updatedOrder);

  return { success: true, order: updatedOrder };
}

export async function finishDeliveryIfDue(orderId) {
  const order = await getOrderById(orderId);

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  if (order.status !== "Delivering") {
    return { success: true, order };
  }

  const startedAt = new Date(order.deliveryStartedAt).getTime();

  if (!Number.isFinite(startedAt)) {
    const updatedOrder = {
      ...order,
      deliveryStartedAt: new Date().toISOString(),
    };

    await redis.set(orderKey(order.id), updatedOrder);

    return { success: true, order: updatedOrder };
  }

  if (Date.now() - startedAt >= DELIVERY_DURATION_MS) {
    const updatedOrder = {
      ...order,
      status: "Delivered",
      deliveredAt: new Date().toISOString(),
    };

    await redis.set(orderKey(order.id), updatedOrder);

    return { success: true, order: updatedOrder };
  }

  return { success: true, order };
}
