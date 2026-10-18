import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import AdminSignInForm from "../../components/AdminSignInForm";

export const metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getSession();

  if (user?.role === "admin") {
    redirect("/admin");
  }

  if (user) {
    redirect(user.role === "staff" ? "/kitchen" : "/");
  }

  return (
    <main className="page-container signin-page">
      <div className="signin-intro">
        <h1>Admin sign in</h1>
      </div>

      <AdminSignInForm />
       <Link href="/signin" className="secondary-button">
          Customer sign in
        </Link>
    </main>
  );
}