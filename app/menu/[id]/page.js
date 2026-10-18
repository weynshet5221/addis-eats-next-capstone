import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getDishById } from "../../../lib/dishes";
import AddToCartButton from "../../../components/AddToCartButton";
import FavoriteButton from "../../../components/FavoriteButton";
import { getSession } from "../../../lib/session";
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish) return { title: "Dish not found" };

  return {
    title: dish.name,
    description: dish.description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: {
      title: `${dish.name} | Addis Eats`,
      description: dish.description,
      images: dish.image ? [`/${String(dish.image).replace(/^\/+/, "")}`] : ["/opengraph.jpg"],
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish) notFound();
const user = await getSession();
  const image = dish.image
    ? `/${String(dish.image).replace(/^\/+/, "")}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    offers: {
      "@type": "Offer",
      price: Number(dish.price || 0),
      priceCurrency: "ETB",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="page-container dish-detail-page">
      <Link href="/menu" className="back-link">
        <ArrowLeft size={18} /> Back to menu
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="dish-detail">
        <div className="dish-detail-image">
          {image ? (
            <Image src={image} alt={dish.name} fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          ) : (
            <div className="image-placeholder">Image unavailable</div>
          )}
        </div>

        <div className="dish-detail-info">
          <p className="eyebrow">{dish.category || "ADDIS EATS MENU"}</p>
          <h1>{dish.name}</h1>
          <p className="dish-detail-description">{dish.description}</p>

          {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 && (
            <div className="ingredients">
              <h2>Ingredients</h2>
              <ul>
                {dish.ingredients.map((ingredient) => (
                  <li key={ingredient}>
                    <CheckCircle2 size={16} /> {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="detail-price">ETB {Number(dish.price || 0).toLocaleString()}</p>
          <div className="detail-actions">
            <AddToCartButton dish={dish} />
            <FavoriteButton
  dish={dish}
  isAuthenticated={Boolean(user)}
/>
          </div>
        </div>
      </article>
    </main>
  );
}