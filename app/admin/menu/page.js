
import Image from "next/image";
import Link from "next/link";
import { UtensilsCrossed, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { getDishes } from "../../../lib/dishes";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../actions";

export const metadata = {
  title: "Menu Management",
};

export default async function AdminMenuPage() {
  const dishes = await getDishes();

  return (
    <section className="admin-menu-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Menu Management</h1>
          <p>Add new dishes or update existing menu items.</p>
        </div>

        <Link href="/menu" className="button button-primary">
          <ExternalLink size={17} />
          View Customer Menu
        </Link>
      </div>

      <section className="admin-menu-form-card">
        <h2>
          <UtensilsCrossed size={21} />
          Add Menu Item
        </h2>

        <form action={createMenuItem} className="admin-menu-form">
          <label>
            Dish name
            <input name="name" required placeholder="e.g. Kitfo" />
          </label>

          <label>
            Category
            <input name="category" required placeholder="e.g. Traditional" />
          </label>

          <label>
            Price (ETB)
            <input name="price" type="number" min="0" step="0.01" required />
          </label>

          <label>
            Image path
            <input name="image" placeholder="images/kitfo.webp" />
          </label>

          <label className="admin-menu-description-field">
            Description
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Describe the dish..."
            />
          </label>

          <button className="button button-primary" type="submit">
            Add Menu Item
          </button>
        </form>
      </section>

      <div className="admin-menu-count">
        <UtensilsCrossed size={20} />
        <span>{dishes.length} menu items</span>
      </div>

      {dishes.length === 0 ? (
        <div className="admin-empty-state">
          <h2>No dishes found</h2>
          <p>Add your first menu item using the form above.</p>
        </div>
      ) : (
        <div className="admin-menu-grid">
          {dishes.map((dish) => {
            const imageSrc =
              typeof dish.image === "string" && dish.image
                ? dish.image.startsWith("/")
                  ? dish.image
                  : `/${dish.image}`
                : "/images/main.png";

            return (
              <article className="admin-menu-card" key={dish.id}>
                <div className="admin-menu-image">
                  <Image
                    src={imageSrc}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 700px) 100vw, 300px"
                  />
                </div>

                <div className="admin-menu-card-content">
                  <span className="admin-menu-category">
                    {dish.category || "Ethiopian Food"}
                  </span>

                  <h2>{dish.name}</h2>
                  <p>{dish.description}</p>
                  <strong>
                    ETB {Number(dish.price || 0).toLocaleString()}
                  </strong>

                  <details className="admin-menu-edit">
                    <summary>
                      <Pencil size={16} />
                      Edit item
                    </summary>

                    <form action={updateMenuItem} className="admin-menu-form">
                      <input type="hidden" name="id" value={dish.id} />

                      <label>
                        Dish name
                        <input name="name" defaultValue={dish.name} required />
                      </label>

                      <label>
                        Category
                        <input
                          name="category"
                          defaultValue={dish.category || ""}
                          required
                        />
                      </label>

                      <label>
                        Price (ETB)
                        <input
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={dish.price}
                          required
                        />
                      </label>

                      <label>
                        Image path
                        <input
                          name="image"
                          defaultValue={dish.image || ""}
                          placeholder="images/kitfo.webp"
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          name="description"
                          defaultValue={dish.description}
                          rows={3}
                          required
                        />
                      </label>

                      <button className="button button-primary" type="submit">
                        Save Changes
                      </button>
                    </form>
                  </details>

                  <form action={deleteMenuItem} className="admin-menu-delete-form">
                    <input type="hidden" name="id" value={dish.id} />
                    <button className="admin-menu-delete-button" type="submit">
                      <Trash2 size={16} />
                      Delete item
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
