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
      <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
        National summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-5"
          >
            <p className="text-2xl font-bold text-[#1a1a1a]">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
