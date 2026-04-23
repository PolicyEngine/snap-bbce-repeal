"use client";

import { colors } from "@policyengine/design-system/tokens/colors";
import { useState, useMemo } from "react";

/* Simplified US state grid layout for a heat-map style view */
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
  return Math.round(n).toString();
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

  /*
   * Generate teal intensity from PE primary palette.
   * Full intensity = primary-700, zero = gray-200.
   * We interpolate RGB between gray-200 and primary-700 using design-system tokens.
   */
  const stateColors = useMemo(() => {
    const parseHex = (hex) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
    const [gR, gG, gB] = parseHex(colors.gray[200]);
    const [pR, pG, pB] = parseHex(colors.primary[700]);
    const result = {};
    for (const row of STATE_GRID.flat()) {
      if (!row) continue;
      const d = stateData[row];
      if (!d) {
        result[row] = colors.gray[100];
      } else if (!d.is_bbce || d.recipients_lost === 0) {
        result[row] = colors.gray[200];
      } else {
        const intensity = d.recipients_lost / maxLost;
        const r = Math.round(gR + (pR - gR) * intensity);
        const g = Math.round(gG + (pG - gG) * intensity);
        const b = Math.round(gB + (pB - gB) * intensity);
        result[row] = `rgb(${r}, ${g}, ${b})`;
      }
    }
    return result;
  }, [stateData, maxLost]);

  const hoveredData = hovered ? stateData[hovered] : null;

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
        State-level impact
      </h2>
      <div
        className="p-4"
        style={{
          backgroundColor: "var(--pe-color-gray-50)",
          border: "1px solid var(--pe-color-border-light)",
          borderRadius: "var(--pe-radius-container)",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="inline-block">
            {STATE_GRID.map((row, ri) => (
              <div key={ri} className="flex">
                {row.map((cell, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className={`w-10 h-10 m-0.5 flex items-center justify-center transition-all ${
                      cell
                        ? "cursor-pointer hover:ring-2"
                        : ""
                    }`}
                    style={{
                      borderRadius: "var(--pe-radius-element)",
                      backgroundColor: cell
                        ? stateColors[cell] || "var(--pe-color-gray-100)"
                        : "transparent",
                      color: cell
                        ? "var(--pe-color-text-primary)"
                        : "transparent",
                      fontSize: "10px",
                      fontWeight: "var(--pe-font-weight-medium)",
                      ...(cell
                        ? { "--tw-ring-color": "var(--pe-color-primary-500)" }
                        : {}),
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
            <div
              className="mt-3 text-center"
              style={{ fontSize: "var(--pe-font-size-sm)" }}
            >
              <span className="font-semibold">{hoveredData.state}</span>
              {hoveredData.is_bbce === true ? (
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

          <div
            className="flex items-center gap-3 mt-4"
            style={{
              fontSize: "var(--pe-font-size-xs)",
              color: "var(--pe-color-text-secondary)",
            }}
          >
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-3"
                style={{
                  backgroundColor: "var(--pe-color-gray-200)",
                  borderRadius: "var(--pe-radius-element)",
                }}
              />
              <span>Non-BBCE / no change</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-3"
                style={{
                  backgroundColor: "var(--pe-color-primary-300)",
                  borderRadius: "var(--pe-radius-element)",
                }}
              />
              <span>Lower impact</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-3"
                style={{
                  backgroundColor: "var(--pe-color-primary-700)",
                  borderRadius: "var(--pe-radius-element)",
                }}
              />
              <span>Higher impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
