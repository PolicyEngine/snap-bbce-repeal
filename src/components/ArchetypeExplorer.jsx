"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from "recharts";

import getCssVar from "../../lib/getCssVar";

export default function ArchetypeExplorer({ data }) {
  const archetypes = useMemo(() => {
    const set = new Set();
    data.forEach((d) => set.add(d.archetype));
    return [...set];
  }, [data]);

  const [selected, setSelected] = useState(archetypes[0] || "");

  const chartData = useMemo(() => {
    return data
      .filter((d) => d.archetype === selected)
      .map((d) => ({
        fpl: d.fpl_pct,
        baseline: d.baseline_snap,
        reform: d.reform_snap,
      }));
  }, [data, selected]);

  const { primaryColor, errorColor, gridColor, grayColor, fontFamily } =
    useMemo(
      () => ({
        primaryColor: getCssVar("--pe-color-primary-500") || "#319795",
        errorColor: getCssVar("--pe-color-error") || "#EF4444",
        gridColor: getCssVar("--pe-color-border-light") || "#E2E8F0",
        grayColor: getCssVar("--pe-color-gray-400") || "#9CA3AF",
        fontFamily:
          getCssVar("--pe-font-family-primary") || "Inter, sans-serif",
      }),
      [],
    );

  return (
    <section>
      <h2
        className="mb-4"
        style={{
          fontSize: "var(--pe-font-size-lg)",
          fontWeight: "var(--pe-font-weight-semibold)",
          color: "var(--pe-color-text-primary)",
        }}
      >
        Household benefit explorer
      </h2>

      <div className="mb-4">
        <label
          htmlFor="household-type"
          className="mr-2"
          style={{
            fontSize: "var(--pe-font-size-sm)",
            color: "var(--pe-color-text-secondary)",
          }}
        >
          Household type:
        </label>
        <select
          id="household-type"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-3 py-1.5"
          style={{
            border: "1px solid var(--pe-color-border-light)",
            borderRadius: "var(--pe-radius-element)",
            fontSize: "var(--pe-font-size-sm)",
            backgroundColor: "var(--pe-color-bg-primary)",
            fontFamily: "var(--pe-font-family-primary)",
          }}
        >
          {archetypes.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div
        className="p-4"
        style={{
          backgroundColor: "var(--pe-color-gray-50)",
          border: "1px solid var(--pe-color-border-light)",
          borderRadius: "var(--pe-radius-container)",
        }}
      >
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="fpl"
              niceTicks
              tick={{ fontSize: 12, fontFamily }}
              label={{
                value: "Household income (% of federal poverty level)",
                position: "bottom",
                offset: 5,
                fontSize: 12,
                fontFamily,
              }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              niceTicks
              tick={{ fontSize: 12, fontFamily }}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              label={{
                value: "Annual SNAP benefit ($)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fontSize: 12,
                fontFamily,
              }}
            />
            <Tooltip
              contentStyle={{ fontFamily }}
              formatter={(v, name) => [
                `$${Math.round(v).toLocaleString()}/year`,
                name === "baseline" ? "Current law" : "After BBCE repeal",
              ]}
              labelFormatter={(v) => `${v}% FPL`}
            />
            <Legend
              wrapperStyle={{ fontFamily }}
              formatter={(v) =>
                v === "baseline" ? "Current law" : "After BBCE repeal"
              }
            />
            <ReferenceArea
              x1={130}
              x2={200}
              fill={primaryColor}
              fillOpacity={0.08}
              label={{
                value: "BBCE zone",
                position: "insideTop",
                fontSize: 11,
                fontFamily,
                fill: primaryColor,
              }}
            />
            <ReferenceLine
              x={130}
              stroke={grayColor}
              strokeDasharray="4 4"
              label={{
                value: "130% FPL",
                position: "top",
                fontSize: 11,
                fontFamily,
                fill: grayColor,
              }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="reform"
              stroke={errorColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p
          className="text-center mt-2"
          style={{
            fontSize: "var(--pe-font-size-xs)",
            color: "var(--pe-color-text-secondary)",
          }}
        >
          The shaded region (130&ndash;200% FPL) shows the income range where
          BBCE currently extends SNAP eligibility beyond the federal limit.
        </p>
      </div>
    </section>
  );
}
