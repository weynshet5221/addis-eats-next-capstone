
"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("addis-eats-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("addis-eats-theme-change", callback);
  };
}

function getThemeSnapshot() {
  return (
    localStorage.getItem("addis-eats-theme") ||
    document.documentElement.dataset.theme ||
    "light"
  );
}

function getServerThemeSnapshot() {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";

    localStorage.setItem("addis-eats-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    window.dispatchEvent(new Event("addis-eats-theme-change"));
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  );
}
