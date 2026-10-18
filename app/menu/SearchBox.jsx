"use client";

import { Search } from "lucide-react";

export default function SearchBox({ value, onChange, placeholder = "Search dishes..." }) {
  return (
    <label className="menu-search">
      <Search size={20} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search dishes"
      />
    </label>
  );
}