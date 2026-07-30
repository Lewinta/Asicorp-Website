import { Banknote, FileText, Check, FileStack, Wallet, CalendarClock } from "lucide-react";
import { fetchResumen } from "@/lib/portal-data";
import { moneyShort } from "@/lib/format";
import { KpiCard } from "@/components/portal/kpi-card";
import { EvolucionChart } from "@/components/portal/analitica/evolucion-chart";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const resumen = await fetchResumen();
  const { mes, anio } = resumen;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-baseline gap-2">
          <h2 className="font-display text-lg font-bold text-foreground">Este mes</h2>
          <span className="text-sm text-muted-foreground">{resumen.mes_label}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Desembolsado" value={moneyShort(mes.desembolsado)} sub="liquidez del mes" icon={Banknote} tone="success" />
          <KpiCard label="Facturado" value={moneyShort(mes.facturado)} sub="facturado este mes" icon={FileText} />
          <KpiCard label="Cobrado" value={moneyShort(mes.cobrado)} sub="cobrado este mes" icon={Check} />
          <KpiCard label="Lotes" value={String(mes.lotes)} sub="lotes del mes" icon={FileStack} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline gap-2">
          <h2 className="font-display text-lg font-bold text-foreground">Acumulado {resumen.anio_label}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Desembolsado" value={moneyShort(anio.desembolsado)} sub="liquidez del año" icon={Banknote} tone="success" />
          <KpiCard label="Facturado" value={moneyShort(anio.facturado)} sub="facturado en el año" icon={FileText} />
          <KpiCard label="Saldo por cobrar" value={moneyShort(anio.pendiente)} sub="pendiente de las ARS" icon={Wallet} />
          <KpiCard label="Próximos vencimientos" value={String(resumen.proximos_vencimientos)} sub="en 15 días" icon={CalendarClock} />
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold text-foreground">Evolución mensual</h2>
          <p className="mb-4 text-sm text-muted-foreground">Facturado vs. liquidez desembolsada.</p>
          {resumen.mensual.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay datos mensuales para mostrar.</p>
          ) : (
            <EvolucionChart rows={resumen.mensual} />
          )}
        </div>
      </section>
    </div>
  );
}
