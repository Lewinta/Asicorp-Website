import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { fetchLineaDetail } from "@/lib/portal-data";
import {
  money, fecha, pct, ESTADO_LINEA_STYLE, ESTADO_LINEA_LABEL, AMORTIZACION_LABEL,
} from "@/lib/format";
import { LineaPagosTable } from "@/components/portal/linea-pagos-table";
import { LineaMovimientosTable } from "@/components/portal/linea-movimientos-table";

export const dynamic = "force-dynamic";

export default async function LineaDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let d;
  try { d = await fetchLineaDetail(name); } catch { notFound(); }

  // La cuota está vencida si su fecha ya pasó. Comparar las cadenas ISO evita
  // que el huso horario del servidor corra la fecha un día.
  const hoy = new Date().toISOString().slice(0, 10);
  const cuotaVencida = !!d.next_amortization && d.next_amortization < hoy;

  const ficha = [
    ["Monto de la línea", money(d.credit_amount)],
    ["Usado", money(d.used_amount)],
    ["Saldo pendiente", money(d.outstanding_amount)],
    ["Interés acumulado", money(d.interest_amount)],
    ["Tasa anual", pct(d.annual_rate)],
    ["Amortización", AMORTIZACION_LABEL[d.amortization_type] ?? d.amortization_type],
    ["Próxima cuota", d.next_amortization ? fecha(d.next_amortization) : "—"],
  ] as const;

  return (
    <div className="space-y-6">
      <Link href="/portal/lineas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a mis líneas
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{d.name}</h1>
          <p className="text-sm text-muted-foreground">{fecha(d.posting_date)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${ESTADO_LINEA_STYLE[d.status] ?? ""}`}>
          {ESTADO_LINEA_LABEL[d.status] ?? d.status}
        </span>
      </div>

      {cuotaVencida && (
        <p className="flex items-start gap-2 rounded-lg bg-[color:var(--danger)]/10 px-3 py-2 text-sm text-[color:var(--danger)]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Tienes una cuota vencida desde el {fecha(d.next_amortization!)}. Contacta a ASICORP para ponerte al día.</span>
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground lg:col-span-1">
          <p className="text-sm opacity-80">Balance disponible</p>
          <p className="mt-2 font-display text-3xl font-bold">{money(d.available_amount)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {ficha.map(([label, val]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Pagos</h2>
        <LineaPagosTable rows={d.pagos} totales={d.totales} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Movimientos de la línea</h2>
        <LineaMovimientosTable rows={d.movimientos} />
      </section>
    </div>
  );
}
