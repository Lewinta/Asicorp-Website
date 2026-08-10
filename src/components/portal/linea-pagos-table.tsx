import { money, fecha } from "@/lib/format";
import type { PagoLinea, LineaCreditoDetail } from "@/lib/portal-types";

export function LineaPagosTable({
  rows, totales,
}: { rows: PagoLinea[]; totales: LineaCreditoDetail["totales"] }) {
  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Aún no se han registrado pagos en esta línea.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Referencia</th>
            <th className="px-4 py-3 text-right">Capital</th><th className="px-4 py-3 text-right">Interés</th>
            <th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">Saldo después</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, idx) => (
            <tr key={idx} className="border-b border-border/60">
              <td className="px-4 py-3 text-muted-foreground">{fecha(p.posting_date)}</td>
              <td className="px-4 py-3 font-medium">{p.referencia}</td>
              <td className="px-4 py-3 text-right">{money(p.capital)}</td>
              <td className="px-4 py-3 text-right">{money(p.interes)}</td>
              <td className="px-4 py-3 text-right font-semibold">{money(p.total)}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{money(p.saldo_despues)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-muted/40 text-sm font-semibold">
            <td className="px-4 py-3" colSpan={2}>Totales</td>
            <td className="px-4 py-3 text-right">{money(totales.capital)}</td>
            <td className="px-4 py-3 text-right">{money(totales.interes)}</td>
            <td className="px-4 py-3 text-right">{money(totales.pagado)}</td>
            <td className="px-4 py-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
