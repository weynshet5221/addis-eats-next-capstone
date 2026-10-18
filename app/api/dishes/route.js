
import { NextResponse } from "next/server";
import { searchDishes } from "../../../lib/dishes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") ?? "";
    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );
    const limit = Math.min(
      12,
      Math.max(1, Number(searchParams.get("limit")) || 6)
    );

    const dishes = await searchDishes(query);
    const total = dishes.length;
    const totalPages = Math.max(
      1,
      Math.ceil(total / limit)
    );
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * limit;

    return NextResponse.json(
      {
        dishes: dishes.slice(start, start + limit),
        page: currentPage,
        limit,
        total,
        totalPages,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load dishes." },
      { status: 500 }
    );
  }
}
