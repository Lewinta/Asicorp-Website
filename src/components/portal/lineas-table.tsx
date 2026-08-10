import Link from "next/link";
import { money, fecha, ESTADO_LINEA_STYLE, ESTADO_LINEA_LABEL } from "@/lib/format";
import type { LineaCreditoRow } from "@/lib/portal-types";

export function LineasTable({ rows }: { rows: LineaCreditoRow[] }) {
  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Aún no tienes líneas de crédito.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Línea</th><th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Monto línea</th>
            <th className="px-4 py-3 text-right">Usado</th><th className="px-4 py-3 text-right">Disponible</th>
            <th className="px-4 py-3 text-right">Saldo pendiente</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              <td className="px-4 py-3 font-medium">
                <Link href={`/portal/lineas/${r.name}`} className="text-primary hover:underline">{r.name}</Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{fecha(r.posting_date)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_LINEA_STYLE[r.status] ?? ""}`}>
                  {ESTADO_LINEA_LABEL[r.status] ?? r.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">{money(r.credit_amount)}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{money(r.used_amount)}</td>
              <td className="px-4 py-3 text-right">{money(r.available_amount)}</td>
              <td className="px-4 py-3 text-right font-semibold">{money(r.outstanding_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
