import StatCard from "./StatCard";

function formatCount(value) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)} billion`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)} million`;
  return Math.round(value).toLocaleString();
}

function formatCurrency(value) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)} billion`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)} million`;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatPercent(value) {
  return `${Math.round(value * 10) / 10}%`;
}

export default function NationalOverview({ data }) {
  const lossRate =
    data.baseline_recipients > 0
      ? (data.recipients_lost / data.baseline_recipients) * 100
      : 0;

  const cards = [
    {
      label: "Current-law SNAP recipients",
      value: formatCount(data.baseline_recipients),
      detail: "Model baseline under current BBCE rules.",
    },
    {
      label: "Recipients after repeal",
      value: formatCount(data.reform_recipients),
      detail: "Projected SNAP recipients if BBCE is repealed.",
      tone: "emphasis",
    },
    {
      label: "People losing SNAP",
      value: formatCount(data.recipients_lost),
      detail: `${formatPercent(lossRate)} of current SNAP recipients.`,
      tone: data.recipients_lost > 0 ? "danger" : "default",
    },
    {
      label: "Annual spending reduction",
      value: formatCurrency(data.savings),
      detail: `Average annual benefit lost per person: $${Math.round(
        data.avg_benefit_lost,
      ).toLocaleString()}`,
    },
  ];

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="dashboard-section-title mb-0">National summary</h2>
          <p className="max-w-3xl text-pe-sm text-pe-text-secondary">
            Under this model, SNAP participation falls from{" "}
            <span className="font-semibold text-pe-text-primary">
              {formatCount(data.baseline_recipients)}
            </span>{" "}
            people under current law to{" "}
            <span className="font-semibold text-pe-text-primary">
              {formatCount(data.reform_recipients)}
            </span>{" "}
            after BBCE repeal.
          </p>
        </div>
        <p className="text-pe-sm text-pe-text-secondary">
          Projected loss rate:{" "}
          <span className="font-semibold text-pe-text-primary">
            {formatPercent(lossRate)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
            tone={card.tone}
          />
        ))}
      </div>
    </section>
  );
}
