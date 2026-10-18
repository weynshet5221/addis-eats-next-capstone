
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { signUp } from "../actions";

export const metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default async function SignupPage({ searchParams }) {
  const user = await getSession();
  const params = await searchParams;

  if (user) {
    redirect("/");
  }

  const error =
    typeof params?.error === "string" ? params.error : "";

  return (
    <main className="page-container signin-page">
      <div className="signin-intro">
        <p className="eyebrow">JOIN ADDIS EATS</p>
        <h1>Create your account</h1>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error === "password"
            ? "Your passwords do not match."
            : error}
        </p>
      )}

      <form action={signUp}>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            minLength={3}
            maxLength={20}
            pattern="[A-Za-z0-9_]+"
            title="Use letters, numbers, or underscores."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <button type="submit">Create Account</button>
      </form>

      <p className="admin-signin-link">
        Already have an account?{" "}
        <Link href="/signin">Sign in</Link>
      </p>
    </main>
  );
}
