import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function getMenuFilePath() {
  return path.join(process.cwd(), "public", "data", "menu.json");
}

export async function getDishes() {
  const content = await readFile(getMenuFilePath(), "utf8");
  const data = JSON.parse(content);

  return Array.isArray(data)
    ? data
    : data.dishes ?? data.items ?? [];
}

export async function saveDishes(dishes) {
  const filePath = getMenuFilePath();
  const content = await readFile(filePath, "utf8");
  const original = JSON.parse(content);

  let updated;

  if (Array.isArray(original)) {
    updated = dishes;
  } else if (Array.isArray(original.dishes)) {
    updated = { ...original, dishes };
  } else if (Array.isArray(original.items)) {
    updated = { ...original, items: dishes };
  } else {
    updated = dishes;
  }

  await writeFile(filePath, JSON.stringify(updated, null, 2) + "\n", "utf8");
}

export async function getDishById(id) {
  const dishes = await getDishes();

  return dishes.find((dish) => String(dish.id) === String(id)) ?? null;
}

export async function searchDishes(query = "") {
  const dishes = await getDishes();
  const term = String(query).trim().toLowerCase();

  if (!term) return dishes;

  return dishes.filter((dish) =>
    [
      dish.name,
      dish.description,
      dish.category,
      ...(dish.ingredients ?? []),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term))
  );
}
