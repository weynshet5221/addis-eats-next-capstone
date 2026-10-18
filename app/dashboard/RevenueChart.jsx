"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);

export default function RevenueChart({ data = [] }) {
  return (
    <section className="rounded-2xl border border-gray-200 p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Revenue by neighbourhood
        </h2>
        <p className="text-sm text-gray-600">
          Revenue in Ethiopian birr (ETB), excluding cancelled
          orders. Bars start at zero.
        </p>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-gray-600">
          No revenue data is available yet.
        </p>
      ) : (
        <>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 12,
                  right: 16,
                  left: 20,
                  bottom: 36,
                }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="neighbourhood"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  height={55}
                />

                <YAxis
                  domain={[0, "auto"]}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en", {
                      notation: "compact",
                    }).format(value)
                  }
                  label={{
                    value: "Revenue (ETB)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -8,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    formatETB(Number(value)),
                    "Revenue",
                  ]}
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue (ETB)"
                  fill="#287849"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="mb-2 text-left font-medium">
                Revenue totals by neighbourhood
              </caption>
              <thead>
                <tr className="border-b">
                  <th scope="col" className="px-3 py-2">
                    Neighbourhood
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right"
                  >
                    Revenue (ETB)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.neighbourhood}
                    className="border-b"
                  >
                    <th
                      scope="row"
                      className="px-3 py-2 font-normal"
                    >
                      {item.neighbourhood}
                    </th>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatETB(item.revenue)}
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