"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function OrdersTrendChart({ data = [] }) {
  return (
    <section className="rounded-2xl border border-gray-200 p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Orders over time
        </h2>
        <p className="text-sm text-gray-600">
          Number of non-cancelled orders per day during the last
          seven days.
        </p>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-gray-600">
          No order activity is available yet.
        </p>
      ) : (
        <>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 12,
                  right: 20,
                  left: 8,
                  bottom: 8,
                }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, "auto"]}
                  label={{
                    value: "Orders (count)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    Number(value),
                    "Orders",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#287849"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="mb-2 text-left font-medium">
                Daily order totals
              </caption>
              <thead>
                <tr className="border-b">
                  <th scope="col" className="px-3 py-2">
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right"
                  >
                    Orders (count)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.date} className="border-b">
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal"
                    >
                      {item.date}
                    </th>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {item.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}