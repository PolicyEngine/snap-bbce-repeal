const LABELS = {
  spm_poverty_rate: "SPM poverty rate",
  spm_child_poverty_rate: "SPM child poverty rate",
  spm_deep_poverty_rate: "SPM deep poverty rate",
  spm_child_deep_poverty_rate: "SPM child deep poverty rate",
};

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function formatPpChange(value) {
  const abs = Math.abs(value);
  if (abs > 0 && abs < 0.1) {
    return `${value >= 0 ? "+" : "-"}<0.1 pp`;
  }
  return `${value >= 0 ? "+" : "-"}${abs.toFixed(1)} pp`;
}

export default function PovertyMetrics({ data }) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="dashboard-section-title mb-0">Poverty impact</h2>
        <p className="max-w-3xl text-pe-sm text-pe-text-secondary">
          Baseline rates use reported SPM resources from the microdata. Repeal
          projections apply the model-estimated change to that benchmark. These
          are dataset baselines, not official Census-published SPM tables, so
          published Census rates can differ from the projected file.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.map((row) => (
          <div key={row.metric} className="dashboard-panel p-5">
            <p className="mb-2 text-pe-sm text-pe-text-secondary">
              {LABELS[row.metric] || row.metric}
            </p>
            <p className="mb-3 text-pe-xs uppercase tracking-[0.16em] text-pe-text-tertiary">
              Reported baseline to projected after repeal
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-pe-xl font-semibold text-pe-text-primary">
                {formatPercent(row.baseline)}
              </span>
              <span className="text-pe-text-tertiary">&rarr;</span>
              <span className="text-pe-xl font-semibold text-pe-text-primary">
                {formatPercent(row.reform)}
              </span>
            </div>
            <p className="mt-2 text-pe-sm font-medium text-pe-error">
              {formatPpChange(row.change)}
            </p>
            {Number.isFinite(row.modeled_baseline) && (
              <p className="mt-2 text-pe-xs text-pe-text-secondary">
                Current-law model on same file:{" "}
                {formatPercent(row.modeled_baseline)}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
