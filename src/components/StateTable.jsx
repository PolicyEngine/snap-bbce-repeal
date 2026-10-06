"use client";

import { useMemo, useState } from "react";

const ALIGNMENT_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function fmt(n) {
  return Math.round(n).toLocaleString();
}

function fmtDollars(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}

function fmtPercent(n) {
  return `${(n * 100).toFixed(1)}%`;
}

const COLUMNS = [
  { key: "state", label: "State", align: "left" },
  { key: "is_bbce", label: "BBCE policy", align: "left" },
  {
    key: "baseline_recipients",
    label: "Current SNAP recipients",
    align: "right",
  },
  {
    key: "reform_recipients",
    label: "After repeal",
    align: "right",
  },
  { key: "recipients_lost", label: "People losing SNAP", align: "right" },
  { key: "loss_rate", label: "Share losing", align: "right" },
  { key: "savings", label: "Spending reduction", align: "right" },
];

export default function StateTable({ data }) {
  const [sortKey, setSortKey] = useState("recipients_lost");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av =
        sortKey === "loss_rate"
          ? a.recipients_lost / a.baseline_recipients || 0
          : a[sortKey];
      const bv =
        sortKey === "loss_rate"
          ? b.recipients_lost / b.baseline_recipients || 0
          : b[sortKey];

      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }

      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortAsc]);

  const totals = useMemo(() => {
    return {
      baseline_recipients: data.reduce(
        (sum, row) => sum + row.baseline_recipients,
        0,
      ),
      reform_recipients: data.reduce(
        (sum, row) => sum + row.reform_recipients,
        0,
      ),
      recipients_lost: data.reduce(
        (sum, row) => sum + row.recipients_lost,
        0,
      ),
      savings: data.reduce((sum, row) => sum + row.savings, 0),
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
    const value = row[col.key];

    if (col.key === "is_bbce") {
      return value === true ? "Uses BBCE" : "No BBCE";
    }

    if (col.key === "loss_rate") {
      return fmtPercent(row.recipients_lost / row.baseline_recipients || 0);
    }

    if (col.key === "savings") return fmtDollars(value);
    if (col.key === "state") return value;
    if (typeof value === "number") return fmt(value);
    return value;
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="dashboard-section-title mb-0">State detail</h2>
        <p className="text-pe-sm text-pe-text-secondary">
          Sort states by current recipients, projected losses, or spending
          reduction to compare current-law SNAP participation against the
          repeal scenario.
        </p>
      </div>

      <div className="dashboard-panel overflow-x-auto">
        <table className="w-full text-pe-sm">
          <thead>
            <tr className="bg-pe-gray-50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`cursor-pointer select-none whitespace-nowrap px-3 py-2.5 font-medium text-pe-text-secondary transition-colors hover:text-pe-primary-500 ${ALIGNMENT_CLASS[col.align]}`}
                  onClick={() => handleSort(col.key)}
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
              const isBbce = row.is_bbce === true;

              return (
                <tr
                  key={row.state}
                  className={`border-t border-pe-border-light ${
                    isBbce ? "bg-pe-bg-primary" : "bg-pe-gray-50"
                  }`}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`${ALIGNMENT_CLASS[col.align]} px-3 py-2 ${
                        col.key === "recipients_lost" &&
                        row.recipients_lost > 0
                          ? "font-medium text-pe-error"
                          : "text-pe-text-primary"
                      }`}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              );
            })}

            <tr className="border-t-2 border-pe-primary-500 bg-pe-gray-50 font-semibold">
              <td className="px-3 py-2 text-left">Total</td>
              <td className="px-3 py-2 text-left">&mdash;</td>
              <td className="px-3 py-2 text-right">
                {fmt(totals.baseline_recipients)}
              </td>
              <td className="px-3 py-2 text-right">
                {fmt(totals.reform_recipients)}
              </td>
              <td className="px-3 py-2 text-right text-pe-error">
                {fmt(totals.recipients_lost)}
              </td>
              <td className="px-3 py-2 text-right">
                {fmtPercent(
                  totals.recipients_lost / totals.baseline_recipients || 0,
                )}
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
