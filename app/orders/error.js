"use client";

import { useEffect } from "react";

export default function OrdersError({ error, reset }) {
  useEffect(() => {
    console.error("Orders page error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900">
        Unable to load orders
      </h2>

      <p className="mt-3 text-gray-600">
        Something went wrong while loading your orders. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
      >
        Try again
      </button>
    </main>
  );
}