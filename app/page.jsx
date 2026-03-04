"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NationalOverview from "../src/components/NationalOverview";
import DistributionalChart from "../src/components/DistributionalChart";
import PovertyMetrics from "../src/components/PovertyMetrics";
import StateTable from "../src/components/StateTable";
import StateMap from "../src/components/StateMap";
import ArchetypeExplorer from "../src/components/ArchetypeExplorer";
import MethodologyNote from "../src/components/MethodologyNote";
import parseCSV from "../lib/parseCSV";

const VALID_TABS = ["overview", "states", "households"];

const PE_LOGO_URL =
  "https://raw.githubusercontent.com/PolicyEngine/policyengine-app-v2/main/app/public/assets/logos/policyengine/white.png";

function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "overview";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/national_summary.csv").then((r) => {
        if (!r.ok) throw new Error("national_summary.csv not found");
        return r.text();
      }),
      fetch("/data/state_impact.csv").then((r) => {
        if (!r.ok) throw new Error("state_impact.csv not found");
        return r.text();
      }),
      fetch("/data/distributional_impact.csv").then((r) => {
        if (!r.ok) throw new Error("distributional_impact.csv not found");
        return r.text();
      }),
      fetch("/data/poverty_metrics.csv").then((r) => {
        if (!r.ok) throw new Error("poverty_metrics.csv not found");
        return r.text();
      }),
      fetch("/data/archetypes.csv").then((r) => {
        if (!r.ok) throw new Error("archetypes.csv not found");
        return r.text();
      }),
    ])
      .then(
        ([national, stateImpact, distributional, poverty, archetypes]) => {
          const nationalRows = parseCSV(national);
          const nationalMap = {};
          nationalRows.forEach((r) => {
            nationalMap[r.metric] = r.value;
          });
          setData({
            national: nationalMap,
            stateImpact: parseCSV(stateImpact),
            distributional: parseCSV(distributional),
            poverty: parseCSV(poverty),
            archetypes: parseCSV(archetypes),
          });
          setLoading(false);
        },
      )
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "overview") {
        router.replace("/", { scroll: false });
      } else {
        router.replace(`/?tab=${tab}`, { scroll: false });
      }
    },
    [router],
  );

  return (
    <div className="min-h-screen bg-pe-bg-primary">
      <header
        className="py-6 px-4"
        style={{ backgroundColor: "var(--pe-color-primary-700)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <img src={PE_LOGO_URL} alt="PolicyEngine" className="h-8" />
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--pe-color-text-inverse)" }}
            >
              SNAP BBCE repeal analysis
            </h1>
            <p
              className="mt-1"
              style={{
                color: "var(--pe-color-primary-200)",
                fontSize: "var(--pe-font-size-sm)",
              }}
            >
              Microsimulation analysis of repealing Broad-Based Categorical
              Eligibility for SNAP
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div
          className="flex gap-1 mb-6"
          style={{ borderBottom: "1px solid var(--pe-color-border-light)" }}
        >
          {[
            { id: "overview", label: "Overview" },
            { id: "states", label: "State impact" },
            { id: "households", label: "Household explorer" },
          ].map((tab) => (
            <button
              key={tab.id}
              className="px-4 py-2.5 font-medium transition-colors cursor-pointer"
              style={{
                fontSize: "var(--pe-font-size-sm)",
                color:
                  activeTab === tab.id
                    ? "var(--pe-color-primary-600)"
                    : "var(--pe-color-text-tertiary)",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid var(--pe-color-primary-500)"
                    : "2px solid transparent",
              }}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <p
            className="py-8 text-center"
            style={{ color: "var(--pe-color-error)" }}
          >
            {error}
          </p>
        )}
        {loading && !error && (
          <p
            className="py-8 text-center"
            style={{ color: "var(--pe-color-text-tertiary)" }}
          >
            Loading data...
          </p>
        )}

        {!loading && !error && data && (
          <>
            {activeTab === "overview" && (
              <div className="space-y-8">
                <NationalOverview data={data.national} />
                <DistributionalChart data={data.distributional} />
                <PovertyMetrics data={data.poverty} />
              </div>
            )}
            {activeTab === "states" && (
              <div className="space-y-8">
                <StateMap data={data.stateImpact} />
                <StateTable data={data.stateImpact} />
              </div>
            )}
            {activeTab === "households" && (
              <div className="space-y-8">
                <ArchetypeExplorer data={data.archetypes} />
                <MethodologyNote />
              </div>
            )}
          </>
        )}

        <footer
          className="mt-12 pt-6 text-center pb-6"
          style={{
            borderTop: "1px solid var(--pe-color-border-light)",
            color: "var(--pe-color-text-tertiary)",
            fontSize: "var(--pe-font-size-xs)",
          }}
        >
          Built by{" "}
          <a
            href="https://policyengine.org"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--pe-color-primary-500)" }}
            className="hover:underline"
          >
            PolicyEngine
          </a>{" "}
          using the Enhanced CPS and PolicyEngine US microsimulation model.
        </footer>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <p
          className="py-8 text-center"
          style={{ color: "var(--pe-color-text-tertiary)" }}
        >
          Loading...
        </p>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
