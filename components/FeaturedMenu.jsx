
import Link from "next/link";
import DishCard from "./DishCard";

export default function FeaturedMenu({
  dishes = [],
  canOrder = true,
  userId = null,
}) {
  return (
    <div>
      <div className="dish-grid">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            canOrder={canOrder}
            userId={userId}
          />
        ))}
      </div>

      <div className="featured-footer">
        <Link href="/menu" className="button button-primary">
          View Full Menu
        </Link>
      </div>
    </div>
  );
}
