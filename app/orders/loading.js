export default function OrdersLoading() {
  return (
    <main className="page-container" aria-busy="true">
      <header className="page-heading">
        <p className="eyebrow">YOUR ORDER HISTORY</p>
        <h1>My orders</h1>
        <p>Loading your orders...</p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <caption className="p-3 text-left">
            Loading order history
          </caption>
          <thead>
            <tr>
              {[
                "Order ID",
                "Items",
                "Neighbourhood",
                "Total",
                "Status",
                "Date",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-3 text-left"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, index) => (
              <tr key={index} className="border-t">
                {Array.from({ length: 6 }, (_, cell) => (
                  <td className="px-4 py-4" key={cell}>
                    <div className="h-4 animate-pulse rounded bg-gray-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}