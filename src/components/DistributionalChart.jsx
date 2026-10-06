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
import { colors } from "@policyengine/design-system/tokens/colors";
import { typography } from "@policyengine/design-system/tokens/typography";

const errorColor = colors.error;
const gridColor = colors.border.light;
const grayColor = colors.gray[200];
const fontFamily = typography.fontFamily.primary;

function formatRelativePercent(value, digits = 1) {
  return `${Number(value).toFixed(digits)}%`;
}

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
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="dashboard-section-title mb-0">
          Distributional impact by income decile
        </h2>
        <div className="dashboard-panel flex gap-1 rounded-pe-element p-0.5">
          {["absolute", "relative"].map((m) => (
            <button
              key={m}
              className={`cursor-pointer rounded-pe-element px-3 py-1 text-pe-xs font-medium transition-colors ${
                mode === m
                  ? "bg-pe-bg-primary text-pe-text-primary shadow-sm"
                  : "text-pe-text-tertiary hover:text-pe-text-primary"
              }`}
              onClick={() => setMode(m)}
            >
              {m === "absolute" ? "Absolute ($)" : "Relative (%)"}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-panel p-4">
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
                  : formatRelativePercent(v, 1)
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
                  : [formatRelativePercent(v, 2), "Change in net income"]
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
          <p className="mt-2 text-center text-pe-xs text-pe-text-secondary">
            Average across all households:{" "}
            {mode === "absolute"
              ? `${allRow.absolute_change < 0 ? "-" : ""}$${Math.abs(allRow.absolute_change)}/year`
              : formatRelativePercent(allRow.relative_change, 2)}
          </p>
        )}
      </div>
    </section>
  );
}
