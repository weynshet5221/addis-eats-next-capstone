import { getDishes } from "./dishes";

export async function getSeedData() {
  const dishes = await getDishes();

  return {
    dishes,
    generatedAt: new Date().toISOString(),
  };
}