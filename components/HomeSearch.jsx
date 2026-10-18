"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(event) {
    event.preventDefault();

    const value = query.trim();

    if (value) {
      router.push(`/menu?q=${encodeURIComponent(value)}`);
    } else {
      router.push("/menu");
    }
  }

  return (
    <form className="home-search" onSubmit={handleSearch} role="search">
      <Search size={21} aria-hidden="true" />

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for kitfo, shiro, doro wat..."
        aria-label="Search dishes"
      />

      <button type="submit" className="primary-button">
        Search
      </button>
    </form>
  );
}