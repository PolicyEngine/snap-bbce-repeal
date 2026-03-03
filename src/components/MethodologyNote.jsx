"use client";

import { useState } from "react";

const NOTES = [
  "This analysis uses PolicyEngine's microsimulation model of the US tax-benefit system, applied to Enhanced CPS microdata calibrated to 2026.",
  "100% takeup: PolicyEngine assumes all eligible households participate. Real SNAP participation is approximately 82%, so actual losses may be lower.",
  "Asset imputation: Bank, stock, and bond assets are imputed from SIPP using quantile regression forests. Precision at the $2,250 asset threshold is uncertain.",
  "State nuances: Some state-specific BBCE conditions (e.g., NY earned-income requirement) are not fully modeled.",
  "Placeholder data: The figures shown are illustrative placeholders pending completion of the microsimulation pipeline.",
];

export default function MethodologyNote() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border border-[#e5e7eb] rounded-lg">
      <button
        className="w-full px-5 py-3 text-left text-sm font-medium text-gray-600 hover:text-[#2C6496] flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>Methodology and caveats</span>
        <span className="text-xs">{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <ul className="space-y-2">
            {NOTES.map((note, i) => (
              <li key={i} className="text-sm text-gray-600 leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
