
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "../app/actions";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setMenuOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
  const role = user?.role;

  const links = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
  ];

  if (!user) {
    links.push({ label: "Sign In", href: "/signin" });
  } else if (role === "customer") {
    links.push(
      { label: "Favorites", href: "/favorites" },
      { label: "Cart", href: "/cart" },
      { label: "My Orders", href: "/orders" }
    );
  } else if (role === "admin") {
    links.push(
      { label: "Admin Dashboard", href: "/admin" },

    );
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-logo" href="/" onClick={() => setMenuOpen(false)}>
          Addis <span>Eats</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}

          {user && (
            <form action={signOut}>
              <button className="nav-link nav-button" type="submit">
                Sign Out
              </button>
            </form>
          )}
        </nav>

        <div className="header-actions">
          {user && (
  <span className="header-username">
    {user.username}
  </span>
)}

<ThemeToggle />
          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <form action={signOut}>
              <button className="nav-link nav-button" type="submit">
                Sign Out
              </button>
            </form>
          )}
        </nav>
      )}
    </header>
  );
}
