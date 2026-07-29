import { fetchLotes } from "@/lib/portal-data";
import { LotesTable } from "@/components/portal/lotes-table";

export const dynamic = "force-dynamic";

export default async function LotesPage() {
  const lotes = await fetchLotes();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Mis lotes</h1>
      <LotesTable rows={lotes} />
    </div>
  );
}
