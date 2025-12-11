"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: { date: string; amount: number }[];
}

export function TransactionChart({ data }: ChartProps) {
  return (
    <div className="h-[350px] w-full rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">
        Transaction Volume (30 Days)
      </h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} // Format to Millions
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                color: "#f1f5f9",
              }}
              itemStyle={{ color: "#10b981" }}
              formatter={(value: number) => [
                `₦${(value / 100).toLocaleString()}`,
                "Volume",
              ]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
