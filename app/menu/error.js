
"use client";

export default function MenuError({ reset }) {
  return (
    <main className="error-page">
      <h1>Unable to load the menu</h1>
      <p>Please try again.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
