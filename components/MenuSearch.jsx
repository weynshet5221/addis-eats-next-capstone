"use client";

import { Search, X } from "lucide-react";

export default function MenuSearch({ value, onChange }) {
  return (
    <section className="homepage-search section-container">
      <label className="menu-search">
        <Search size={21} aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search dishes, ingredients, or categories..."
          aria-label="Search menu"
        />
        {value && (
          <button
            type="button"
            className="clear-search"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </label>
    </section>
  );
}