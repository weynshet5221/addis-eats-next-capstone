"use server";
import { registerUser } from "../lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser, getSession } from "../lib/session";
import { cancelOrderForUser, updateOrderStatus as changeOrderStatus } from "../lib/orders";
import { revalidatePath } from "next/cache";
import { getDishes, saveDishes } from "../lib/dishes";
function safeNext(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) return "/";
  return value;
}

export async function signIn(previousState, formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));
const result = await authenticateUser(username, password);
  if (!result || result.user.role === "admin") {
    return {
      error: "Invalid customer or staff credentials. Admins must use admin sign-in.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("session", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(
    result.user.role === "staff"
      ? "/kitchen"
      : next
  );
}

export async function adminSignIn(previousState, formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
const result = await authenticateUser(username, password);
  if (!result || result.user.role !== "admin") {
    return { error: "Invalid administrator credentials." };
  }

  const cookieStore = await cookies();

  cookieStore.set("session", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}

export async function cancelOrder(formData) {
  const user = await getSession();
  if (!user) redirect("/signin");

  const orderId = String(formData.get("orderId") || "");
const result = await cancelOrderForUser(orderId, user.id);
  if (!result.success) throw new Error(result.error);
  redirect("/orders");
}

export async function setOrderStatus(formData) {
  const user = await getSession();

  if (!user || !["staff", "admin"].includes(user.role)) {
    throw new Error("You are not allowed to update orders.");
  }

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "");
const result = await changeOrderStatus(orderId, status);  if (!result.success) throw new Error(result.error);
  redirect("/kitchen");
}
export async function setAdminOrderStatus(formData) {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    throw new Error("Only administrators can update order status.");
  }

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "");

  const result = changeOrderStatus(orderId, status);

 if (!result.success) {
  throw new Error(result.error);
}

revalidatePath("/orders");
revalidatePath("/admin/orders");
revalidatePath(`/orders/${encodeURIComponent(orderId)}/tracking`);

redirect("/admin/orders");
}

export async function createMenuItem(formData) {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    throw new Error("Only administrators can manage the menu.");
  }

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price"));
  const imageInput = String(formData.get("image") || "").trim();

  if (!name || !description || !category || !Number.isFinite(price) || price < 0) {
    throw new Error("Enter a valid name, description, category, and price.");
  }

  const image = imageInput
    ? imageInput.startsWith("/")
      ? imageInput
      : `/${imageInput}`
    : "/images/main.png";

  const dishes = await getDishes();

  dishes.push({
    id: String(Date.now()),
    name,
    description,
    category,
    price,
    image,
  });

  await saveDishes(dishes);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  redirect("/admin/menu");
}

export async function updateMenuItem(formData) {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    throw new Error("Only administrators can manage the menu.");
  }

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price"));
  const imageInput = String(formData.get("image") || "").trim();

  if (!id || !name || !description || !category || !Number.isFinite(price) || price < 0) {
    throw new Error("Enter valid details for the dish.");
  }

  const dishes = await getDishes();
  const index = dishes.findIndex((dish) => String(dish.id) === id);

  if (index === -1) {
    throw new Error("Dish not found.");
  }

  const image = imageInput
    ? imageInput.startsWith("/")
      ? imageInput
      : `/${imageInput}`
    : "/images/main.png";

  dishes[index] = {
    ...dishes[index],
    name,
    description,
    category,
    price,
    image,
  };

  await saveDishes(dishes);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  redirect("/admin/menu");
}

export async function deleteMenuItem(formData) {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    throw new Error("Only administrators can manage the menu.");
  }

  const id = String(formData.get("id") || "");
  const dishes = await getDishes();
  const updatedDishes = dishes.filter((dish) => String(dish.id) !== id);

  if (updatedDishes.length === dishes.length) {
    throw new Error("Dish not found.");
  }

  await saveDishes(updatedDishes);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  redirect("/admin/menu");
}
export async function signUp(formData) {
  const name = String(formData.get("name") || "");
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(
    formData.get("confirmPassword") || ""
  );

  if (password !== confirmPassword) {
    redirect("/signup?error=password");
  }

const result = await registerUser({ name, username, password });
  if (result.error) {
    redirect(
      `/signup?error=${encodeURIComponent(result.error)}`
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("session", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}
