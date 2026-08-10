import Link from "next/link";
import { money, fecha } from "@/lib/format";
import type { MovimientoLinea } from "@/lib/portal-types";

export function LineaMovimientosTable({ rows }: { rows: MovimientoLinea[] }) {
  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Esta línea no tiene movimientos registrados.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Concepto</th>
            <th className="px-4 py-3">Referencia</th><th className="px-4 py-3 text-right">Monto</th>
            <th className="px-4 py-3 text-right">Saldo después</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m, idx) => (
            <tr key={idx} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fecha(m.posting_date)}</td>
              <td className="px-4 py-3 font-medium">{m.entry_type}</td>
              <td className="px-4 py-3">
                {m.reference_type === "Lote" && m.reference_name ? (
                  <Link href={`/portal/lotes/${m.reference_name}`} className="text-primary hover:underline">
                    {m.reference_name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{m.reference_name || "—"}</span>
                )}
                {m.comment && <p className="mt-0.5 text-xs text-muted-foreground">{m.comment}</p>}
              </td>
              <td className="px-4 py-3 text-right font-semibold">{money(m.amount)}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{money(m.amount_after_transaction)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
