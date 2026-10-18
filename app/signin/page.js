import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import SignInForm from "../../components/SignInForm";
import Link from "next/link";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }) {
  const user = await getSession();
  const params = await searchParams;

  const requestedNext =
    typeof params?.next === "string" ? params.next : "/";

  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (user) {
    redirect(next);
  }

  return (
    <main className="page-container signin-page">
      <div className="signin-intro">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in </h1>
      </div>

      <SignInForm next={next} />
<p className="admin-signin-link">
  Don't have an account?{" "}
  <Link href="/signup">Create account</Link>
</p>
      <p className="admin-signin-link">
        Are you an administrator?{" "}
        <Link href="/admin-login">Sign in as Admin</Link>
      </p>
    </main>
  );
}