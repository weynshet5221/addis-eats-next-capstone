import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { getSession } from "../lib/session";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Addis Eats",
    template: "%s | Addis Eats",
  },
  description:
    "Discover Ethiopian favorites and delicious meals with Addis Eats.",
  openGraph: {
    type: "website",
    siteName: "Addis Eats",
    title: "Addis Eats | Delicious Food, Delivered",
    description:
      "Discover Ethiopian favorites and delicious meals with Addis Eats.",
    images: ["/opengraph.jpg"],
  },
};

export default async function RootLayout({ children }) {
  const user = await getSession();

  return (
    <html lang="en">
      <body>
        <SiteHeader user={user} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
