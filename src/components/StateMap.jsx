"use client";

import { useMemo, useState } from "react";

import { colors } from "@policyengine/design-system/tokens/colors";

import StatCard from "./StatCard";

const STATE_GRID = [
  [null, null, null, null, null, null, null, null, null, null, null, "AK"],
  ["WA", "MT", "ND", "MN", "WI", "MI", null, null, "VT", "NH", "ME", null],
  ["OR", "ID", "SD", "IA", "IL", "IN", "OH", "PA", "NY", "MA", "CT", "RI"],
  ["CA", "NV", "WY", "NE", "MO", "KY", "WV", "VA", "MD", "DE", "NJ", null],
  [null, "UT", "CO", "KS", "AR", "TN", "NC", "SC", "DC", null, null, null],
  ["HI", "AZ", "NM", "OK", "LA", "MS", "AL", "GA", null, null, null, null],
  [null, null, null, "TX", null, null, null, "FL", null, null, null, null],
];

function formatCount(n) {
  return Math.round(n).toLocaleString();
}

function formatCurrency(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}

function formatCompact(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return Math.round(n).toString();
}

export default function StateMap({ data }) {
  const stateOptions = useMemo(
    () => [...data].sort((a, b) => a.state.localeCompare(b.state)),
    [data],
  );
  const [selected, setSelected] = useState(
    stateOptions.find((row) => row.recipients_lost > 0)?.state ??
      stateOptions[0]?.state ??
      null,
  );
  const [hovered, setHovered] = useState(null);

  const stateData = useMemo(() => {
    const map = {};
    data.forEach((row) => {
      map[row.state] = row;
    });
    return map;
  }, [data]);

  const maxLost = useMemo(
    () => Math.max(1, ...data.map((d) => d.recipients_lost)),
    [data],
  );

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
      const current = stateData[row];

      if (!current) {
        result[row] = colors.gray[100];
      } else if (!current.is_bbce || current.recipients_lost === 0) {
        result[row] = colors.gray[200];
      } else {
        const intensity = current.recipients_lost / maxLost;
        const r = Math.round(gR + (pR - gR) * intensity);
        const g = Math.round(gG + (pG - gG) * intensity);
        const b = Math.round(gB + (pB - gB) * intensity);
        result[row] = `rgb(${r}, ${g}, ${b})`;
      }
    }

    return result;
  }, [stateData, maxLost]);

  const activeState = hovered ?? selected;
  const activeData = activeState ? stateData[activeState] : null;
  const lossRate =
    activeData && activeData.baseline_recipients > 0
      ? (activeData.recipients_lost / activeData.baseline_recipients) * 100
      : 0;

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="dashboard-section-title mb-0">State-level impact</h2>
          <p className="max-w-3xl text-pe-sm text-pe-text-secondary">
            Compare each state&apos;s current-law SNAP recipients with the
            repeal scenario, and see whether the state currently uses BBCE.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-pe-sm text-pe-text-secondary">
          <span>Selected state</span>
          <select
            className="dashboard-control px-3 py-2"
            value={selected ?? ""}
            onChange={(event) => setSelected(event.target.value)}
          >
            {stateOptions.map((row) => (
              <option key={row.state} value={row.state}>
                {row.state}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="dashboard-panel p-4 md:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="flex flex-col items-center">
            <div className="inline-block">
              {STATE_GRID.map((row, ri) => (
                <div key={ri} className="flex">
                  {row.map((cell, ci) => {
                    if (!cell) {
                      return (
                        <div
                          key={`${ri}-${ci}`}
                          className="m-0.5 h-10 w-10"
                          aria-hidden="true"
                        />
                      );
                    }

                    const isSelected = cell === selected;
                    const isHovered = cell === hovered;

                    return (
                      <button
                        type="button"
                        key={`${ri}-${ci}`}
                        className={`m-0.5 flex h-10 w-10 items-center justify-center rounded-pe-element text-[10px] font-medium text-pe-text-primary transition-all ${
                          isSelected || isHovered
                            ? "ring-2 ring-pe-primary-500 ring-offset-2 ring-offset-pe-gray-50"
                            : "hover:ring-2 hover:ring-pe-primary-500"
                        }`}
                        style={{
                          backgroundColor:
                            stateColors[cell] || "var(--pe-color-gray-100)",
                        }}
                        onMouseEnter={() => setHovered(cell)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setSelected(cell)}
                        aria-pressed={isSelected}
                        aria-label={`Show SNAP repeal impact for ${cell}`}
                      >
                        {cell}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-pe-xs text-pe-text-secondary">
              <div className="flex items-center gap-1">
                <div className="h-3 w-4 rounded-pe-element bg-pe-gray-200" />
                <span>Non-BBCE / no change</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-4 rounded-pe-element bg-pe-primary-200" />
                <span>Lower impact</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-4 rounded-pe-element bg-pe-primary-700" />
                <span>Higher impact</span>
              </div>
            </div>

            {activeData && (
              <p className="mt-4 text-center text-pe-sm text-pe-text-secondary">
                {activeData.state}{" "}
                {activeData.is_bbce
                  ? `uses BBCE and is projected to lose ${formatCompact(
                      activeData.recipients_lost,
                    )} SNAP recipients.`
                  : "does not currently use BBCE in this model, so repeal is projected to have no effect."}
              </p>
            )}
          </div>

          {activeData && (
            <aside className="space-y-4">
              <div className="space-y-2">
                <p className="text-pe-xs uppercase tracking-[0.18em] text-pe-text-tertiary">
                  Selected state
                </p>
                <h3 className="text-3xl font-semibold tracking-tight text-pe-text-primary">
                  {activeData.state}
                </h3>
                <p className="text-pe-sm text-pe-text-secondary">
                  {activeData.is_bbce
                    ? "Current BBCE policy: state uses BBCE."
                    : "Current BBCE policy: state does not use BBCE."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <StatCard
                  label="Current SNAP recipients"
                  value={formatCount(activeData.baseline_recipients)}
                  detail="Model baseline under current law."
                />
                <StatCard
                  label="Recipients after repeal"
                  value={formatCount(activeData.reform_recipients)}
                  detail="Projected recipients if BBCE is repealed."
                  tone="emphasis"
                />
                <StatCard
                  label="People losing SNAP"
                  value={formatCount(activeData.recipients_lost)}
                  detail={`${Math.round(lossRate * 10) / 10}% of current recipients.`}
                  tone={activeData.recipients_lost > 0 ? "danger" : "default"}
                />
                <StatCard
                  label="Annual spending reduction"
                  value={formatCurrency(activeData.savings)}
                  detail={
                    activeData.is_bbce
                      ? "Projected decline in annual SNAP benefits."
                      : "No projected change under repeal."
                  }
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
