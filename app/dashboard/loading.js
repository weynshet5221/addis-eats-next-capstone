export default function DashboardLoading() {
  return (
    <main className="page-container space-y-8" aria-busy="true">
      <header className="page-heading">
        <h1>Analytics dashboard</h1>
        <p>Loading analytics...</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-gray-200"
          />
        ))}
      </div>

      {[1, 2].map((item) => (
        <div
          key={item}
          className="h-96 animate-pulse rounded-2xl bg-gray-200"
        />
      ))}
    </main>
  );
}