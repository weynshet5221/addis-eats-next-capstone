"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="error-page">
      <p className="eyebrow">SOMETHING WENT WRONG</p>
      <h1>We could not load this page</h1>
      <p>Please try again.</p>
      <button className="button button-primary" type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}