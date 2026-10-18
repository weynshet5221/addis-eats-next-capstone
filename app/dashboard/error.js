"use client";

export default function DashboardError({ reset }) {
  return (
    <main className="page-container">
      <section className="empty-state" role="alert">
        <h1>Unable to load analytics</h1>
        <p>
          The dashboard could not retrieve the data. Please try again.
        </p>
        <button
          type="button"
          className="button button-primary"
          onClick={reset}
        >
          Try again
        </button>
      </section>
    </main>
  );
}