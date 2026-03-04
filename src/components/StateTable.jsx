"use client";

import { useState, useMemo } from "react";

function fmt(n) {
  return Math.round(n).toLocaleString();
}

function fmtDollars(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}

const COLUMNS = [
  { key: "state", label: "State", align: "left" },
  { key: "is_bbce", label: "BBCE", align: "center" },
  { key: "baseline_recipients", label: "Baseline recipients", align: "right" },
  { key: "reform_recipients", label: "Reform recipients", align: "right" },
  { key: "recipients_lost", label: "Recipients lost", align: "right" },
  { key: "savings", label: "Spending reduction", align: "right" },
];

export default function StateTable({ data }) {
  const [sortKey, setSortKey] = useState("recipients_lost");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let av = a[sortKey],
        bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortAsc]);

  const totals = useMemo(() => {
    return {
      baseline_recipients: data.reduce(
        (s, r) => s + r.baseline_recipients,
        0,
      ),
      reform_recipients: data.reduce((s, r) => s + r.reform_recipients, 0),
      recipients_lost: data.reduce((s, r) => s + r.recipients_lost, 0),
      savings: data.reduce((s, r) => s + r.savings, 0),
    };
  }, [data]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  function renderCell(row, col) {
    const v = row[col.key];
    if (col.key === "is_bbce") {
      return String(v).toLowerCase() === "true" ? "Yes" : "No";
    }
    if (col.key === "savings") return fmtDollars(v);
    if (col.key === "state") return v;
    if (typeof v === "number") return fmt(v);
    return v;
  }

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
        State detail
      </h2>
      <div
        className="overflow-x-auto"
        style={{
          border: "1px solid var(--pe-color-border-light)",
          borderRadius: "var(--pe-radius-container)",
        }}
      >
        <table
          className="w-full"
          style={{ fontSize: "var(--pe-font-size-sm)" }}
        >
          <thead>
            <tr style={{ backgroundColor: "var(--pe-color-gray-50)" }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 font-medium cursor-pointer select-none whitespace-nowrap text-${col.align}`}
                  style={{ color: "var(--pe-color-text-secondary)" }}
                  onClick={() => handleSort(col.key)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      "var(--pe-color-primary-500)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      "var(--pe-color-text-secondary)")
                  }
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">
                      {sortAsc ? "\u25B2" : "\u25BC"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isBbce =
                String(row.is_bbce).toLowerCase() === "true";
              return (
                <tr
                  key={row.state}
                  style={{
                    borderTop: "1px solid var(--pe-color-border-light)",
                    backgroundColor: isBbce
                      ? "var(--pe-color-bg-primary)"
                      : "var(--pe-color-gray-50)",
                  }}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-${col.align}`}
                      style={{
                        color:
                          col.key === "recipients_lost" &&
                          row.recipients_lost > 0
                            ? "var(--pe-color-error)"
                            : "var(--pe-color-text-primary)",
                        fontWeight:
                          col.key === "recipients_lost" &&
                          row.recipients_lost > 0
                            ? "var(--pe-font-weight-medium)"
                            : "var(--pe-font-weight-normal)",
                      }}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr
              className="font-semibold"
              style={{
                borderTop: "2px solid var(--pe-color-primary-500)",
                backgroundColor: "var(--pe-color-gray-50)",
              }}
            >
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-center">&mdash;</td>
              <td className="px-3 py-2 text-right">
                {fmt(totals.baseline_recipients)}
              </td>
              <td className="px-3 py-2 text-right">
                {fmt(totals.reform_recipients)}
              </td>
              <td
                className="px-3 py-2 text-right"
                style={{ color: "var(--pe-color-error)" }}
              >
                {fmt(totals.recipients_lost)}
              </td>
              <td className="px-3 py-2 text-right">
                {fmtDollars(totals.savings)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
