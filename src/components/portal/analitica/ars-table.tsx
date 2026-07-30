import { money, pct } from "@/lib/format";
import type { ArsRow } from "@/lib/portal-types";

function glosaPill(tasa: number): string {
  if (tasa <= 2) return "bg-[color:var(--success)]/15 text-[color:var(--success)]";
  if (tasa <= 5) return "bg-[color:#c68a12]/15 text-[#b3790a]";
  return "bg-[color:var(--danger)]/15 text-[color:var(--danger)]";
}

export function ArsTable({ rows }: { rows: ArsRow[] }) {
  if (!rows.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Aún no hay facturación registrada por ARS.
      </p>
    );
  }
  const maxFacturado = Math.max(...rows.map((r) => r.facturado), 1);
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 text-left">ARS</th>
            <th className="px-4 py-3 text-right">Facturado</th>
            <th className="px-4 py-3 text-right">Neto recibido</th>
            <th className="px-4 py-3 text-right">Pendiente</th>
            <th className="px-4 py-3 text-right">Glosa</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ars} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-foreground">{r.ars}</span>
                  <span className="block h-1.5 w-32 overflow-hidden rounded-full bg-brand-tint">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(r.facturado / maxFacturado) * 100}%` }}
                    />
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{money(r.facturado)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{money(r.neto)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{money(r.pendiente)}</td>
              <td className="px-4 py-3 text-right">
                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${glosaPill(r.tasa_glosa)}`}>
                  {pct(r.tasa_glosa)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
