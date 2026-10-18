
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  const isCustomerRoute = [
    "/cart",
    "/checkout",
    "/favorites",
    "/orders",
  ].some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isCustomerRoute && !token) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !token) {
    return NextResponse.redirect(
      new URL("/admin-login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/favorites/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
