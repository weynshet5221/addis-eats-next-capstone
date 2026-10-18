
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import FavoritesContent from "../../components/FavoritesContent";

export const metadata = {
  title: "Favorite Dishes",
};

export default async function FavoritesPage() {
  const user = await getSession();

  if (!user || user.role !== "customer") {
    redirect("/signin?next=%2Ffavorites");
  }

  return <FavoritesContent userId={user.id} />;
}
