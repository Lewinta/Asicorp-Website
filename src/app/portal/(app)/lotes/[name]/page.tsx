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

  // "Cobrado por Cedente" solo aplica cuando la ARS le pagó directo al cedente en vez de
  // a ASICORP. En la mayoría de los lotes está en cero, así que la columna se oculta
  // salvo que alguna factura del lote la traiga con valor.
  const showCobradoCedente = d.facturas.some((f) => (f.cobrado_por_cedente ?? 0) > 0);

  // El endpoint no envía la tasa del impuesto; se deriva del monto (hoy 0.2% del
  // monto total) para que el cedente vea el porcentaje aplicado.
  const impuestoTasa = d.monto_total > 0 && d.impuesto_monto > 0
    ? (d.impuesto_monto / d.monto_total) * 100 : 0;
  const impuestoLabel = impuestoTasa > 0
    ? `Impuesto (${new Intl.NumberFormat("es-DO", { maximumFractionDigits: 2 }).format(impuestoTasa)}%)`
    : "Impuesto";

  const totales = [
    ["Monto total", d.monto_total], ["Comisión", d.comision_monto],
    ["Reserva", d.reserva_monto], [impuestoLabel, d.impuesto_monto],
    ["Deducciones", d.deducciones_totales],
  ] as const;

  // Lotes viejos no traen recobros/devoluciones: se tratan como listas vacías y 0.
  const recobros = d.recobros ?? [];
  const devoluciones = d.devoluciones ?? [];
  const recobroMonto = d.recobro_monto ?? 0;
  const lineaConversionMonto = d.linea_conversion_monto ?? 0;
  // Las devoluciones suman al neto (a favor del cedente); neto_desembolsar ya las incluye.
  const devolucionesTotales = d.devoluciones_totales ?? 0;

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
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Devoluciones</dt>
              <dd className={`font-medium ${devolucionesTotales > 0 ? "text-[color:var(--success)]" : ""}`}>
                +{money(devolucionesTotales)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Facturas por cobrar</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className={`w-full text-sm ${showCobradoCedente ? "min-w-[860px]" : "min-w-[720px]"}`}>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">NCF</th><th className="px-4 py-3">Referencia</th>
                <th className="px-4 py-3">Cliente</th><th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3 text-right">Cobrado</th>
                {showCobradoCedente && <th className="px-4 py-3 text-right">Cobrado por Cedente</th>}
                <th className="px-4 py-3 text-right">Glosado</th>
                <th className="px-4 py-3 text-right">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {d.facturas.map((f, idx) => (
                <tr key={idx} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{f.ncf || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.referencia || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.cliente || "—"}</td>
                  <td className="px-4 py-3 text-right">{money(f.monto)}</td>
                  <td className="px-4 py-3 text-right">{money(f.cobrado)}</td>
                  {showCobradoCedente && (
                    <td className="px-4 py-3 text-right">{money(f.cobrado_por_cedente ?? 0)}</td>
                  )}
                  <td className={`px-4 py-3 text-right ${f.glosado > 0 ? "font-medium text-[color:var(--danger)]" : "text-muted-foreground"}`}>{money(f.glosado)}</td>
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

      {devoluciones.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">Devoluciones</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {devoluciones.map((x, idx) => (
                  <tr key={idx} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium">{x.descripcion || "—"}</td>
                    <td className="px-4 py-3 text-right">{money(x.monto)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">Total devuelto al cedente</td>
                  <td className="px-4 py-3 text-right font-semibold text-[color:var(--success)]">{money(devolucionesTotales)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}

      {recobros.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">Recobros de lotes anteriores</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Lote origen</th><th className="px-4 py-3">Factura</th>
                  <th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Resolución</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {recobros.map((r, idx) => (
                  <tr key={idx} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium">{r.lote_origen || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.factura_referencia || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.cliente || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.tipo || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.resolucion || "—"}</td>
                    <td className="px-4 py-3 text-right">{money(r.monto_recobro)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td colSpan={5} className="px-4 py-3 font-semibold">Descontado del desembolso</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(recobroMonto)}</td>
                </tr>
                {lineaConversionMonto > 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 pb-3 font-semibold">Pasado a Línea de Crédito</td>
                    <td className="px-4 pb-3 text-right font-semibold">{money(lineaConversionMonto)}</td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
