"use client";

function formatNumber(value) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)} billion`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)} million`;
  return value.toLocaleString();
}

export default function NationalOverview({ data }) {
  const cards = [
    {
      label: "People losing SNAP",
      value: formatNumber(data.recipients_lost),
    },
    {
      label: "Annual spending reduction",
      value: formatNumber(data.savings),
    },
    {
      label: "Average benefit lost",
      value: `$${Math.round(data.avg_benefit_lost).toLocaleString()}/year`,
    },
  ];

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
        National summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5"
            style={{
              backgroundColor: "var(--pe-color-gray-50)",
              border: "1px solid var(--pe-color-border-light)",
              borderRadius: "var(--pe-radius-container)",
            }}
          >
            <p
              className="font-bold"
              style={{
                fontSize: "var(--pe-font-size-2xl)",
                color: "var(--pe-color-text-primary)",
              }}
            >
              {card.value}
            </p>
            <p
              className="mt-1"
              style={{
                fontSize: "var(--pe-font-size-sm)",
                color: "var(--pe-color-text-secondary)",
              }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
