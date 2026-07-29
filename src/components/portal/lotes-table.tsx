import Link from "next/link";
import { money, fecha, ESTADO_STYLE } from "@/lib/format";
import type { LoteRow } from "@/lib/portal-types";

export function LotesTable({ rows }: { rows: LoteRow[] }) {
  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Aún no tienes lotes registrados.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Lote</th><th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Monto total</th>
            <th className="px-4 py-3 text-right">Neto desembolsado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              <td className="px-4 py-3 font-medium">
                <Link href={`/portal/lotes/${r.name}`} className="text-primary hover:underline">{r.name}</Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{fecha(r.fecha)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_STYLE[r.estado] ?? ""}`}>{r.estado}</span>
              </td>
              <td className="px-4 py-3 text-right">{money(r.monto_total)}</td>
              <td className="px-4 py-3 text-right font-semibold">{money(r.neto_desembolsar)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
