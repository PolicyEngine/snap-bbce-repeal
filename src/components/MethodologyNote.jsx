"use client";

import { useState } from "react";

const NOTES = [
  "This analysis uses PolicyEngine's microsimulation model of the US tax-benefit system, applied to Enhanced CPS microdata calibrated to 2026.",
  "The BBCE state list follows USDA FNS guidance updated December 29, 2025.",
  "Recipient counts are person-level. Spending totals are summed from unduplicated household SNAP allotments.",
  "Poverty cards are benchmark-anchored: baseline levels come from reported SPM resources in the analysis microdata, and repeal effects use the model-estimated change from that baseline.",
  "Published Census SPM tables can differ materially from these poverty baselines because this app uses a projected microdata file rather than the published Census tabulations directly.",
  "100% takeup: PolicyEngine assumes all eligible households participate. Real SNAP participation is approximately 82%, so actual losses may be lower.",
  "Asset imputation: Bank, stock, and bond assets are imputed from SIPP using quantile regression forests. Precision at the $2,250 asset threshold is uncertain.",
  "State nuances: Some state-specific BBCE conditions (e.g., NY earned-income requirement) are not fully modeled.",
  "Magnitude calibration: Our estimates of budgetary savings are higher than external benchmarks (USDA, CBO, CBPP) due to differences in microdata weighting and benefit-level calibration. Directional results and relative patterns are more reliable than absolute magnitudes.",
];

export default function MethodologyNote() {
  const [open, setOpen] = useState(false);

  return (
    <section className="dashboard-panel bg-pe-bg-primary">
      <button
        className="flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left text-pe-sm font-medium text-pe-text-secondary transition-colors hover:text-pe-primary-500"
        onClick={() => setOpen(!open)}
      >
        <span>Methodology and caveats</span>
        <span className="text-pe-xs">{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <ul className="space-y-2">
            {NOTES.map((note, i) => (
              <li
                key={i}
                className="text-pe-sm leading-relaxed text-pe-text-secondary"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
