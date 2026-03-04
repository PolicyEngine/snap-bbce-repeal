"use client";

import { useState, useMemo } from "react";
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
import getCssVar from "../../lib/getCssVar";

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

  /* Resolve tokens for Recharts (SVG needs raw values) */
  const { errorColor, gridColor, grayColor, fontFamily } = useMemo(
    () => ({
      errorColor: getCssVar("--pe-color-error") || "#EF4444",
      gridColor: getCssVar("--pe-color-border-light") || "#E2E8F0",
      grayColor: getCssVar("--pe-color-gray-200") || "#E2E8F0",
      fontFamily:
        getCssVar("--pe-font-family-primary") || "Inter, sans-serif",
    }),
    [],
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{
            fontSize: "var(--pe-font-size-lg)",
            fontWeight: "var(--pe-font-weight-semibold)",
            color: "var(--pe-color-text-primary)",
          }}
        >
          Distributional impact by income decile
        </h2>
        <div
          className="flex gap-1 p-0.5"
          style={{
            backgroundColor: "var(--pe-color-gray-50)",
            borderRadius: "var(--pe-radius-element)",
            border: "1px solid var(--pe-color-border-light)",
          }}
        >
          {["absolute", "relative"].map((m) => (
            <button
              key={m}
              className="px-3 py-1 font-medium transition-colors cursor-pointer"
              style={{
                fontSize: "var(--pe-font-size-xs)",
                borderRadius: "var(--pe-radius-element)",
                backgroundColor:
                  mode === m ? "var(--pe-color-bg-primary)" : "transparent",
                color:
                  mode === m
                    ? "var(--pe-color-text-primary)"
                    : "var(--pe-color-text-tertiary)",
                boxShadow: mode === m ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
              onClick={() => setMode(m)}
            >
              {m === "absolute" ? "Absolute ($)" : "Relative (%)"}
            </button>
          ))}
        </div>
      </div>

      <div
        className="p-4"
        style={{
          backgroundColor: "var(--pe-color-gray-50)",
          border: "1px solid var(--pe-color-border-light)",
          borderRadius: "var(--pe-radius-container)",
        }}
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="decile"
              niceTicks
              tick={{ fontSize: 12, fontFamily }}
            />
            <YAxis
              niceTicks
              domain={["auto", "auto"]}
              tickCount={6}
              tick={{ fontSize: 12, fontFamily }}
              tickFormatter={(v) =>
                mode === "absolute"
                  ? v < 0
                    ? `-$${Math.abs(v)}`
                    : `$${v}`
                  : `${v}%`
              }
            />
            <Tooltip
              contentStyle={{ fontFamily }}
              formatter={(v) =>
                mode === "absolute"
                  ? [
                      `${v < 0 ? "-" : ""}$${Math.abs(v)}/year`,
                      "Change in net income",
                    ]
                  : [`${v}%`, "Change in net income"]
              }
            />
            <ReferenceLine y={0} stroke={grayColor} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value < 0 ? errorColor : grayColor}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {allRow && (
          <p
            className="text-center mt-2"
            style={{
              fontSize: "var(--pe-font-size-xs)",
              color: "var(--pe-color-text-secondary)",
            }}
          >
            Average across all households:{" "}
            {mode === "absolute"
              ? `${allRow.absolute_change < 0 ? "-" : ""}$${Math.abs(allRow.absolute_change)}/year`
              : `${allRow.relative_change}%`}
          </p>
        )}
      </div>
    </section>
  );
}
