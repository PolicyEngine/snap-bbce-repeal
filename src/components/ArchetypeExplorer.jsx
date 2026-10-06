"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { colors } from "@policyengine/design-system/tokens/colors";
import { typography } from "@policyengine/design-system/tokens/typography";

const primaryColor = colors.primary[500];
const errorColor = colors.error;
const gridColor = colors.border.light;
const grayColor = colors.gray[400];
const fontFamily = typography.fontFamily.primary;

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

  return (
    <section>
      <h2 className="dashboard-section-title">Household benefit explorer</h2>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="household-type"
          className="text-pe-sm text-pe-text-secondary"
        >
          Household type
        </label>
        <select
          id="household-type"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="dashboard-control px-3 py-2"
        >
          {archetypes.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-panel p-4">
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
              domain={["auto", "auto"]}
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
        <p className="mt-2 text-center text-pe-xs text-pe-text-secondary">
          The shaded region (130&ndash;200% FPL) shows the income range where
          BBCE currently extends SNAP eligibility beyond the federal limit.
        </p>
      </div>
    </section>
  );
}
