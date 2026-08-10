import { fetchLineas } from "@/lib/portal-data";
import { LineasTable } from "@/components/portal/lineas-table";

export const dynamic = "force-dynamic";

export default async function LineasPage() {
  const lineas = await fetchLineas();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Líneas de crédito</h1>
      <LineasTable rows={lineas} />
    </div>
  );
}
