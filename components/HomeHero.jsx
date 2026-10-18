
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="hero-fullscreen">
      <div className="hero-overlay" />

      <div className="hero-content">

        <h1>
          Your favorite Ethiopian food,
          <span> made with love.</span>
        </h1>

        <p className="hero-description">
          Discover traditional flavors, freshly prepared meals, and the
          dishes that bring people together. Your next favorite meal is here.
        </p>

        <div className="hero-actions">
          <Link href="/menu" className="button button-primary">
            Explore Our Menu
          </Link>

          <Link href="/menu" className="button button-outline">
            Discover Our Food
          </Link>
        </div>
      </div>

    </section>
  );
}
