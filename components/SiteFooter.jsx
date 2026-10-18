import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark"><UtensilsCrossed size={21} /></span>
            <span>Addis Eats</span>
          </Link>
          <p>Discover Ethiopian favorites and delicious meals made for sharing.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/favorites">Favorites</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Addis Eats. Made with care.
      </div>
    </footer>
  );
}