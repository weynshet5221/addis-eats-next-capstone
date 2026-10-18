import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/signin");
  return user;
}

export async function requireRole(roles) {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    redirect("/");
  }

  return user;
}