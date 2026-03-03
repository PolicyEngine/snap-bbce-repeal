"use client";

const LABELS = {
  spm_poverty_rate: "SPM poverty rate",
  spm_deep_poverty_rate: "SPM deep poverty rate",
  spm_child_poverty_rate: "SPM child poverty rate",
};

export default function PovertyMetrics({ data }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
        Poverty impact
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((row) => (
          <div
            key={row.metric}
            className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-5"
          >
            <p className="text-sm text-gray-500 mb-2">
              {LABELS[row.metric] || row.metric}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-[#1a1a1a]">
                {row.baseline}%
              </span>
              <span className="text-gray-400">&rarr;</span>
              <span className="text-xl font-bold text-[#1a1a1a]">
                {row.reform}%
              </span>
            </div>
            <p className="text-sm mt-2 text-red-600 font-medium">
              +{row.change} pp
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
