"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export default function DistributionalChart({ data }) {
  const [mode, setMode] = useState("absolute");

  const chartData = data
    .filter((d) => d.decile !== "All")
    .map((d) => ({
      decile: d.decile,
      value:
        mode === "absolute" ? d.absolute_change : d.relative_change,
    }));

  const allRow = data.find((d) => d.decile === "All");

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">
          Distributional impact by income decile
        </h2>
        <div className="flex gap-1 bg-[#f8f9fa] rounded-md p-0.5 border border-[#e5e7eb]">
          <button
            className={`px-3 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
              mode === "absolute"
                ? "bg-white text-[#1a1a1a] shadow-sm"
                : "text-gray-500"
            }`}
            onClick={() => setMode("absolute")}
          >
            Absolute ($)
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
              mode === "relative"
                ? "bg-white text-[#1a1a1a] shadow-sm"
                : "text-gray-500"
            }`}
            onClick={() => setMode("relative")}
          >
            Relative (%)
          </button>
        </div>
      </div>

      <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="decile" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) =>
                mode === "absolute" ? `$${v}` : `${v}%`
              }
            />
            <Tooltip
              formatter={(v) =>
                mode === "absolute"
                  ? [`$${v}/year`, "Change in net income"]
                  : [`${v}%`, "Change in net income"]
              }
            />
            <ReferenceLine y={0} stroke="#666" />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value < 0 ? "#dc2626" : "#e5e7eb"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {allRow && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Average across all households:{" "}
            {mode === "absolute"
              ? `$${allRow.absolute_change}/year`
              : `${allRow.relative_change}%`}
          </p>
        )}
      </div>
    </section>
  );
}
