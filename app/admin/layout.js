
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { signOut } from "../actions";
import AdminSidebar from "../../components/AdminSidebar";

export default async function AdminLayout({ children }) {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/admin-login");
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <strong>Admin Workspace</strong>
          </div>

          <div className="admin-user">
            <span className="admin-avatar">
              {(user.name || "A").charAt(0).toUpperCase()}
            </span>
            <span className="admin-user-name">
              {user.name || "Administrator"}
            </span>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
