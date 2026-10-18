import { ImageResponse } from "next/og";
import { getDishById } from "../../../lib/dishes";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: "#173d24",
          color: "#ffffff",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 28, color: "#ffb16d" }}>ADDIS EATS</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 28 }}>
          {dish?.name || "Discover our menu"}
        </div>
        <div style={{ fontSize: 30, marginTop: 22 }}>
          {dish ? `ETB ${Number(dish.price || 0).toLocaleString()}` : "Delicious food, delivered"}
        </div>
      </div>
    ),
    size
  );
}