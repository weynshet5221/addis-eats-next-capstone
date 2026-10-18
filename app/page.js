
import HomeHero from "../components/HomeHero";
import HomeSearch from "../components/HomeSearch";
import FeaturedMenu from "../components/FeaturedMenu";
import { getDishes } from "../lib/dishes";
import { getSession } from "../lib/session";

export default async function HomePage() {
  const [dishes, user] = await Promise.all([
    getDishes(),
    getSession(),
  ]);

  const canOrder = !user || user.role === "customer";
  const userId = user?.role === "customer" ? user.id : null;

  return (
    <main>
      <HomeHero />

      <section className="home-search-section">
        <div className="section-heading">
          <h2>What are you craving?</h2>
          <p>Search our menu for your next delicious meal.</p>
        </div>

        <HomeSearch />
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <h2>Popular Dishes</h2>
        </div>

        <FeaturedMenu
          dishes={dishes.slice(0, 3)}
          canOrder={canOrder}
          userId={userId}
        />
      </section>
    </main>
  );
}
