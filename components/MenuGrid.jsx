"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import useDebounce from "../hooks/useDebounce";
import fetcher from "../lib/fetcher";
import DishCard from "./DishCard";
import MenuSkeleton from "./MenuSkeleton";
import MenuSearch from "./MenuSearch";

export default function MenuGrid({
  canOrder = true,
  userId = null,
  initialData,
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return (
    <MenuGridContent
      key={initialQuery}
      initialQuery={initialQuery}
      initialData={initialData}
      canOrder={canOrder}
      userId={userId}
    />
  );
}

function MenuGridContent({
  initialQuery,
  initialData,
  canOrder,
  userId,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 300);

  const hasServerData =
    Boolean(initialData) &&
    !initialQuery &&
    !debouncedQuery &&
    page === 1;

  const params = new URLSearchParams({
    q: debouncedQuery,
    page: String(page),
    limit: "6",
  });

  const { data, error, isLoading } = useSWR(
    `/api/dishes?${params.toString()}`,
    fetcher,
    {
      fallbackData: hasServerData ? initialData : undefined,
      revalidateOnMount: !hasServerData,
      keepPreviousData: true,
      dedupingInterval: 5000,
    }
  );

  function handleQueryChange(value) {
    setQuery(value);
    setPage(1);
  }

  const showSkeleton = isLoading && !data;

  return (
    <section className="menu-content">
      <MenuSearch value={query} onChange={handleQueryChange} />

      {error && !data && (
        <p className="error-message" role="alert">
          Could not load the menu. Please refresh and try again.
        </p>
      )}

      {showSkeleton && <MenuSkeleton />}

      {!showSkeleton && !error && data?.dishes?.length === 0 && (
        <div className="empty-state">
          <h2>No dishes found</h2>
          <p>Try another dish name or category.</p>
        </div>
      )}

      {!showSkeleton && data?.dishes?.length > 0 && (
        <>
          <div className="dish-grid">
            {data.dishes.map((dish, index) => (
              <DishCard
                key={dish.id}
                dish={dish}
                canOrder={canOrder}
                userId={userId}
                priorityImage={index === 0 && page === 1 && !debouncedQuery}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="button button-secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>

            <span>
              Page {data.page} of {data.totalPages}
            </span>

            <button
              type="button"
              className="button button-secondary"
              disabled={page >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}