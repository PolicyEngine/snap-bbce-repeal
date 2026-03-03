"use client";

import { useState, useMemo } from "react";

function fmt(n) {
  return n.toLocaleString();
}

function fmtDollars(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
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
      return v === "true" || v === true ? "Yes" : "No";
    }
    if (col.key === "savings") return fmtDollars(v);
    if (col.key === "state") return v;
    if (typeof v === "number") return fmt(v);
    return v;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
        State detail
      </h2>
      <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8f9fa]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 font-medium text-gray-600 cursor-pointer hover:text-[#2C6496] select-none whitespace-nowrap text-${col.align}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortAsc ? "\u25B2" : "\u25BC"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isBbce =
                row.is_bbce === "true" || row.is_bbce === true;
              return (
                <tr
                  key={row.state}
                  className={`border-t border-[#e5e7eb] ${
                    isBbce ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-${col.align} ${
                        col.key === "recipients_lost" && row.recipients_lost > 0
                          ? "text-red-600 font-medium"
                          : "text-[#1a1a1a]"
                      }`}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="border-t-2 border-[#2C6496] bg-[#f8f9fa] font-semibold">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-center">&mdash;</td>
              <td className="px-3 py-2 text-right">
                {fmt(totals.baseline_recipients)}
              </td>
              <td className="px-3 py-2 text-right">
                {fmt(totals.reform_recipients)}
              </td>
              <td className="px-3 py-2 text-right text-red-600">
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
