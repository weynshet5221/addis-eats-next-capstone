import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="error-page">
      <SearchX size={46} />
      <p className="eyebrow">404 — PAGE NOT FOUND</p>
      <h1>We couldn&apos;t find that page</h1>
      <p>The page or dish may have moved or no longer exists.</p>
      <Link href="/" className="button button-primary">Return home</Link>
    </main>
  );
}