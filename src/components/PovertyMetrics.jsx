"use client";

const LABELS = {
  spm_poverty_rate: "SPM poverty rate",
  spm_child_poverty_rate: "SPM child poverty rate",
  spm_deep_poverty_rate: "SPM deep poverty rate",
  spm_child_deep_poverty_rate: "SPM child deep poverty rate",
};

export default function PovertyMetrics({ data }) {
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
        Poverty impact
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((row) => (
          <div
            key={row.metric}
            className="p-5"
            style={{
              backgroundColor: "var(--pe-color-gray-50)",
              border: "1px solid var(--pe-color-border-light)",
              borderRadius: "var(--pe-radius-container)",
            }}
          >
            <p
              className="mb-2"
              style={{
                fontSize: "var(--pe-font-size-sm)",
                color: "var(--pe-color-text-secondary)",
              }}
            >
              {LABELS[row.metric] || row.metric}
            </p>
            <div className="flex items-baseline gap-3">
              <span
                className="font-bold"
                style={{
                  fontSize: "var(--pe-font-size-xl)",
                  color: "var(--pe-color-text-primary)",
                }}
              >
                {row.baseline}%
              </span>
              <span style={{ color: "var(--pe-color-text-tertiary)" }}>
                &rarr;
              </span>
              <span
                className="font-bold"
                style={{
                  fontSize: "var(--pe-font-size-xl)",
                  color: "var(--pe-color-text-primary)",
                }}
              >
                {row.reform}%
              </span>
            </div>
            <p
              className="mt-2 font-medium"
              style={{
                fontSize: "var(--pe-font-size-sm)",
                color: "var(--pe-color-error)",
              }}
            >
              +{row.change} pp
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
