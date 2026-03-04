"use client";

import { useState } from "react";

const NOTES = [
  "This analysis uses PolicyEngine's microsimulation model of the US tax-benefit system, applied to Enhanced CPS microdata calibrated to 2026.",
  "100% takeup: PolicyEngine assumes all eligible households participate. Real SNAP participation is approximately 82%, so actual losses may be lower.",
  "Asset imputation: Bank, stock, and bond assets are imputed from SIPP using quantile regression forests. Precision at the $2,250 asset threshold is uncertain.",
  "State nuances: Some state-specific BBCE conditions (e.g., NY earned-income requirement) are not fully modeled.",
  "Magnitude calibration: Our estimates of budgetary savings are higher than external benchmarks (USDA, CBO, CBPP) due to differences in microdata weighting and benefit-level calibration. Directional results and relative patterns are more reliable than absolute magnitudes.",
];

export default function MethodologyNote() {
  const [open, setOpen] = useState(false);

  return (
    <section
      style={{
        border: "1px solid var(--pe-color-border-light)",
        borderRadius: "var(--pe-radius-container)",
      }}
    >
      <button
        className="w-full px-5 py-3 text-left font-medium flex items-center justify-between cursor-pointer transition-colors"
        style={{
          fontSize: "var(--pe-font-size-sm)",
          color: "var(--pe-color-text-secondary)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--pe-color-primary-500)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--pe-color-text-secondary)")
        }
        onClick={() => setOpen(!open)}
      >
        <span>Methodology and caveats</span>
        <span style={{ fontSize: "var(--pe-font-size-xs)" }}>
          {open ? "\u25B2" : "\u25BC"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <ul className="space-y-2">
            {NOTES.map((note, i) => (
              <li
                key={i}
                className="leading-relaxed"
                style={{
                  fontSize: "var(--pe-font-size-sm)",
                  color: "var(--pe-color-text-secondary)",
                }}
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
