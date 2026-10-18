import { signOut } from "../actions";

export const metadata = { title: "Sign out", robots: { index: false } };

export default function SignOutPage() {
  return (
    <main className="page-container narrow-container">
      <h1>Sign out</h1>
      <p>Are you sure you want to sign out?</p>
      <form action={signOut}>
        <button className="button button-primary" type="submit">Sign out</button>
      </form>
    </main>
  );
}