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
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <header className="bg-[#2C6496] text-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            SNAP BBCE repeal analysis
          </h1>
          <p className="text-white/80 mt-1 text-sm">
            PolicyEngine microsimulation analysis of repealing Broad-Based
            Categorical Eligibility for SNAP
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "states", label: "State impact" },
            { id: "households", label: "Household explorer" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "text-[#2C6496] border-b-2 border-[#2C6496]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 py-8 text-center">{error}</p>}
        {loading && !error && (
          <p className="text-gray-500 py-8 text-center">Loading data...</p>
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

        <footer className="mt-12 pt-6 border-t border-gray-200 text-gray-500 text-xs text-center pb-6">
          Built by{" "}
          <a
            href="https://policyengine.org"
            target="_blank"
            rel="noreferrer"
            className="text-[#2C6496] hover:underline"
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
      fallback={<p className="text-gray-500 py-8 text-center">Loading...</p>}
    >
      <Dashboard />
    </Suspense>
  );
}
