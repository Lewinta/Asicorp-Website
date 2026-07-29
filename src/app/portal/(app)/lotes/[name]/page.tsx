import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { fetchLoteDetail } from "@/lib/portal-data";
import { money, fecha, ESTADO_STYLE } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LoteDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let d;
  try { d = await fetchLoteDetail(name); } catch { notFound(); }

  const totales = [
    ["Monto total", d.monto_total], ["Comisión", d.comision_monto],
    ["Reserva", d.reserva_monto], ["Impuesto", d.impuesto_monto],
    ["Deducciones", d.deducciones_totales],
  ] as const;

  return (
    <div className="space-y-6">
      <Link href="/portal/lotes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a mis lotes
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{d.name}</h1>
          <p className="text-sm text-muted-foreground">{fecha(d.fecha)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${ESTADO_STYLE[d.estado] ?? ""}`}>{d.estado}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground lg:col-span-1">
          <p className="text-sm opacity-80">Neto desembolsado</p>
          <p className="mt-2 font-display text-3xl font-bold">{money(d.neto_desembolsar)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {totales.map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{money(val as number)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Facturas por cobrar</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">NCF</th><th className="px-4 py-3">Referencia</th>
                <th className="px-4 py-3">Vencimiento</th><th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3 text-right">Cobrado</th><th className="px-4 py-3 text-right">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {d.facturas.map((f, idx) => (
                <tr key={idx} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{f.ncf || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.referencia || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fecha(f.vencimiento)}</td>
                  <td className="px-4 py-3 text-right">{money(f.monto)}</td>
                  <td className="px-4 py-3 text-right">{money(f.cobrado)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(f.pendiente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {d.deducciones.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">Deducciones</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Deducción</th><th className="px-4 py-3">Detalle</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {d.deducciones.map((x, idx) => (
                  <tr key={idx} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium">{x.deduccion}</td>
                    <td className="px-4 py-3 text-muted-foreground">{x.detalle || "—"}</td>
                    <td className="px-4 py-3 text-right">{money(x.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
