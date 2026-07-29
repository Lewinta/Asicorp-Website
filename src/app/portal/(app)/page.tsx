import { fetchSummary, fetchLotes } from "@/lib/portal-data";
import { KpiCards } from "@/components/portal/kpi-cards";
import { LotesTable } from "@/components/portal/lotes-table";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const [summary, lotes] = await Promise.all([fetchSummary(), fetchLotes()]);
  return (
    <div className="space-y-6">
      <KpiCards s={summary} />
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Lotes recientes</h2>
        <LotesTable rows={lotes.slice(0, 8)} />
      </div>
    </div>
  );
}
