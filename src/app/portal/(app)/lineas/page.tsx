import { redirect } from "next/navigation";
import { fetchLineas } from "@/lib/portal-data";
import { LineasTable } from "@/components/portal/lineas-table";

export const dynamic = "force-dynamic";

export default async function LineasPage() {
  const lineas = await fetchLineas();
  // La sección solo está disponible si el cedente tiene líneas (mismo criterio
  // que el nav condicional). Sin líneas → no hay pantalla, aunque entren por URL.
  if (lineas.length === 0) redirect("/portal");
  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Líneas de crédito</h1>
      <LineasTable rows={lineas} />
    </div>
  );
}
