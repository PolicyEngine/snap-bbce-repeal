"use client";

import { useState, useMemo } from "react";

// Simplified US state grid layout for a heat-map style view
const STATE_GRID = [
  [null, null, null, null, null, null, null, null, null, null, null, "AK"],
  ["WA", "MT", "ND", "MN", "WI", "MI", null, null, "VT", "NH", "ME", null],
  ["OR", "ID", "SD", "IA", "IL", "IN", "OH", "PA", "NY", "MA", "CT", "RI"],
  ["CA", "NV", "WY", "NE", "MO", "KY", "WV", "VA", "MD", "DE", "NJ", null],
  [null, "UT", "CO", "KS", "AR", "TN", "NC", "SC", "DC", null, null, null],
  ["HI", "AZ", "NM", "OK", "LA", "MS", "AL", "GA", null, null, null, null],
  [null, null, null, "TX", null, null, null, "FL", null, null, null, null],
];

function formatCompact(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

export default function StateMap({ data }) {
  const [hovered, setHovered] = useState(null);

  const stateData = useMemo(() => {
    const map = {};
    data.forEach((row) => {
      map[row.state] = row;
    });
    return map;
  }, [data]);

  const maxLost = useMemo(() => {
    return Math.max(...data.map((d) => d.recipients_lost));
  }, [data]);

  function getColor(abbr) {
    const row = stateData[abbr];
    if (!row) return "#f3f4f6";
    if (row.is_bbce === "false" || row.is_bbce === false) return "#e5e7eb";
    if (row.recipients_lost === 0) return "#e5e7eb";
    const intensity = row.recipients_lost / maxLost;
    const r = Math.round(44 + (220 - 44) * (1 - intensity));
    const g = Math.round(100 + (230 - 100) * (1 - intensity));
    const b = Math.round(150 + (245 - 150) * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  }

  const hoveredData = hovered ? stateData[hovered] : null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
        State-level impact
      </h2>
      <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4">
        <div className="flex flex-col items-center">
          <div className="inline-block">
            {STATE_GRID.map((row, ri) => (
              <div key={ri} className="flex">
                {row.map((cell, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className={`w-10 h-10 m-0.5 rounded text-[10px] font-medium flex items-center justify-center transition-all ${
                      cell
                        ? "cursor-pointer hover:ring-2 hover:ring-[#2C6496]"
                        : ""
                    }`}
                    style={{
                      backgroundColor: cell ? getColor(cell) : "transparent",
                      color: cell ? "#1a1a1a" : "transparent",
                    }}
                    onMouseEnter={() => cell && setHovered(cell)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {cell || ""}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {hoveredData && (
            <div className="mt-3 text-sm text-center">
              <span className="font-semibold">{hoveredData.state}</span>
              {hoveredData.is_bbce === "true" || hoveredData.is_bbce === true ? (
                <>
                  {" "}
                  &mdash; {formatCompact(hoveredData.recipients_lost)} lose
                  SNAP, ${formatCompact(hoveredData.savings)} savings
                </>
              ) : (
                <> &mdash; non-BBCE state (no change)</>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 rounded bg-[#e5e7eb]" />
              <span>Non-BBCE / no change</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-3 rounded"
                style={{ backgroundColor: "rgb(132, 165, 198)" }}
              />
              <span>Lower impact</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-3 rounded"
                style={{ backgroundColor: "rgb(44, 100, 150)" }}
              />
              <span>Higher impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
