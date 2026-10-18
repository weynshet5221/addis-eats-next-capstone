
import MenuGrid from "../../components/MenuGrid";
import { getSession } from "../../lib/session";
import { searchDishes } from "../../lib/dishes";

export const metadata = {
  title: "Menu",
  description: "Explore Ethiopian favorites on the Addis Eats menu.",
};

const PAGE_SIZE = 6;

export default async function MenuPage() {
  const user = await getSession();
  const canOrder = !user || user.role === "customer";
  const userId = user?.role === "customer" ? user.id : null;

  const dishes = await searchDishes("");

  const initialData = {
    dishes: dishes.slice(0, PAGE_SIZE),
    page: 1,
    limit: PAGE_SIZE,
    total: dishes.length,
    totalPages: Math.max(1, Math.ceil(dishes.length / PAGE_SIZE)),
  };

  return (
    <main className="page-container menu-page">
      <div className="section-heading">
        <p className="section-eyebrow">EXPLORE OUR FOOD</p>
        <h1>Our Menu</h1>
        <p>Find your favorite Ethiopian dishes.</p>
      </div>

      {!canOrder && (
        <p className="role-notice">
          You are viewing the menu in admin mode. Ordering is disabled.
        </p>
      )}

      <MenuGrid
        canOrder={canOrder}
        userId={userId}
        initialData={initialData}
      />
    </main>
  );
}
