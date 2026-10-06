import { Suspense } from "react";

import { loadDashboardData } from "../lib/loadDashboardData";
import DashboardClient from "../src/components/DashboardClient";
import DashboardView from "../src/components/DashboardView";

export default async function Page() {
  const data = await loadDashboardData();

  return (
    <Suspense fallback={<DashboardView data={data} activeTab="overview" />}>
      <DashboardClient data={data} />
    </Suspense>
  );
}
