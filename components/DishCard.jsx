
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";

export default function DishCard({
  dish,
  canOrder = true,
  userId = null,
  priorityImage = false,
}) {
  const imagePath = dish.image
    ? dish.image.startsWith("/")
      ? dish.image
      : `/${dish.image}`
    : "/images/main.png";

  return (
    <article className="dish-card">
      <div className="dish-image-wrap">
        <Link
          href={`/menu/${dish.id}`}
          className="dish-image-link"
          aria-label={`View ${dish.name}`}
        >
          <Image
            src={imagePath}
            alt={dish.name}
            fill

sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc((100vw - 32px) / 2), (max-width: 1600px) calc((100vw - 64px) / 3), 400px"            className="dish-image"
            loading={priorityImage ? "eager" : "lazy"}
            fetchPriority={priorityImage ? "high" : "auto"}
          />
        </Link>

        {canOrder && (
          <div className="dish-favorite-overlay">
            <FavoriteButton dish={dish} userId={userId} />
          </div>
        )}
      </div>

      <div className="dish-card-content">
        <p className="dish-category">
          {dish.category || "Ethiopian Food"}
        </p>

        <h3>
          <Link href={`/menu/${dish.id}`}>{dish.name}</Link>
        </h3>

        <p className="dish-description">{dish.description}</p>

        <div className="dish-card-bottom">
          <strong className="dish-price">
            {Number(dish.price || 0).toLocaleString()} ETB
          </strong>
        </div>

        {canOrder && <AddToCartButton dish={dish} />}
      </div>
    </article>
  );
}
