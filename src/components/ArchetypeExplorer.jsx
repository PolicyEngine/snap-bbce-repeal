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
      <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
        Household benefit explorer
      </h2>

      <div className="mb-4">
        <label className="text-sm text-gray-600 mr-2">Household type:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border border-[#e5e7eb] rounded px-3 py-1.5 text-sm bg-white"
        >
          {archetypes.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="fpl"
              tick={{ fontSize: 12 }}
              label={{
                value: "Household income (% of federal poverty level)",
                position: "bottom",
                offset: 5,
                fontSize: 12,
              }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              label={{
                value: "Annual SNAP benefit ($)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fontSize: 12,
              }}
            />
            <Tooltip
              formatter={(v, name) => [
                `$${v.toLocaleString()}/year`,
                name === "baseline" ? "Current law" : "After BBCE repeal",
              ]}
              labelFormatter={(v) => `${v}% FPL`}
            />
            <Legend
              formatter={(v) =>
                v === "baseline" ? "Current law" : "After BBCE repeal"
              }
            />
            <ReferenceArea
              x1={130}
              x2={200}
              fill="#2C6496"
              fillOpacity={0.08}
              label={{
                value: "BBCE zone",
                position: "insideTop",
                fontSize: 11,
                fill: "#2C6496",
              }}
            />
            <ReferenceLine
              x={130}
              stroke="#999"
              strokeDasharray="4 4"
              label={{
                value: "130% FPL",
                position: "top",
                fontSize: 11,
                fill: "#666",
              }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#2C6496"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="reform"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 text-center mt-2">
          The shaded region (130&ndash;200% FPL) shows the income range where
          BBCE currently extends SNAP eligibility beyond the federal limit.
        </p>
      </div>
    </section>
  );
}
