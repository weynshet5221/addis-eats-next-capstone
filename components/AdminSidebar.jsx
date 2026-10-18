"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "../app/actions";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Menu management",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function closeSidebar() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="admin-mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close admin navigation" : "Open admin navigation"}
        aria-expanded={open}
        aria-controls="admin-sidebar"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          onClick={closeSidebar}
          aria-label="Close navigation"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${open ? "is-open" : ""}`}
      >
        <Link
          href="/admin"
          className="admin-brand"
          onClick={closeSidebar}
        >
          <span className="admin-brand-name">
          </span>

        </Link>

        <p className="admin-nav-label">WORKSPACE</p>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`admin-nav-link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                title={label}
              >
                <Icon size={19} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link
            href="/"
            className="admin-nav-link"
            onClick={closeSidebar}
            title="Customer website"
          >
            <ExternalLink size={19} />
            <span>Customer website</span>
          </Link>

          <form action={signOut}>
            <button
              className="admin-signout"
              type="submit"
              onClick={closeSidebar}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
