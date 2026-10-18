"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import useDebounce from "../hooks/useDebounce";
import MenuSearch from "./MenuSearch";
import HomeHero from "./HomeHero";
import FeaturedMenu from "./FeaturedMenu";

export default function HomeContent({ initialDishes = [] }) {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounce(term, 300);
  const key = debouncedTerm.trim()
    ? `/api/dishes?q=${encodeURIComponent(debouncedTerm)}&page=1&limit=6`
    : null;

  const { data, error, isLoading } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  const visibleDishes = useMemo(() => {
    if (!debouncedTerm.trim()) return initialDishes.slice(0, 3);
    return data?.dishes ?? [];
  }, [initialDishes, debouncedTerm, data]);

  return (
    <>
      <MenuSearch value={term} onChange={setTerm} />
      <HomeHero />
      <FeaturedMenu dishes={visibleDishes.slice(0, 3)} />
      {isLoading && <p className="search-status" aria-live="polite">Updating results...</p>}
      {error && <p className="menu-message" role="alert">Search failed. Please try again.</p>}
      {debouncedTerm.trim() && !isLoading && !error && (
        <p className="search-status" aria-live="polite">
          {data?.total ?? 0} matching dishes found.
        </p>
      )}
    </>
  );
}