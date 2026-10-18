import { NextResponse } from "next/server";
import { getSession } from "../../../lib/session";
import { getDishById } from "../../../lib/dishes";
import { createOrderForUser } from "../../../lib/orders";
import { NEIGHBOURHOODS } from "../../../lib/neighbourhoods";

export async function POST(request) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in before placing an order." },
      { status: 401 }
    );
  }

  if (user.role !== "customer") {
    return NextResponse.json(
      { error: "Staff accounts cannot place customer orders." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { items, neighbourhood } = body;

    if (
      typeof neighbourhood !== "string" ||
      !NEIGHBOURHOODS.includes(neighbourhood)
    ) {
      return NextResponse.json(
        { error: "Please select a valid neighbourhood." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const trustedItems = [];

    for (const item of items) {
      const dish = await getDishById(item.id);
      const quantity = Number(item.quantity);

      if (
        !dish ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        return NextResponse.json(
          { error: "One or more order items are invalid." },
          { status: 400 }
        );
      }

      trustedItems.push({
        id: dish.id,
        name: dish.name,
        price: Number(dish.price),
        quantity,
      });
    }

    const result = await createOrderForUser({
      userId: user.id,
      items: trustedItems,
      neighbourhood,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { order: result.order },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to create your order." },
      { status: 500 }
    );
  }
}