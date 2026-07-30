import { FileText, Banknote, Check, Clock, TriangleAlert } from "lucide-react";
import { moneyShort, pct } from "@/lib/format";
import { KpiCard } from "@/components/portal/kpi-card";
import type { PortalAnalytics } from "@/lib/portal-types";

export function AnaliticaKpis({ t }: { t: PortalAnalytics["totales"] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      <KpiCard
        label="Total facturado"
        value={moneyShort(t.facturado)}
        sub={`${t.n_facturas} facturas · ${t.n_ars} ARS`}
        icon={FileText}
      />
      <KpiCard
        label="Neto desembolsado"
        value={moneyShort(t.neto_desembolsado)}
        sub="liquidez recibida"
        icon={Banknote}
        tone="success"
      />
      <KpiCard
        label="Cobrado"
        value={moneyShort(t.cobrado)}
        sub="cobrado a las ARS"
        icon={Check}
      />
      <KpiCard
        label="Pendiente"
        value={moneyShort(t.pendiente)}
        sub="por cobrar a las ARS"
        icon={Clock}
      />
      <KpiCard
        label="Glosado"
        value={moneyShort(t.glosado)}
        sub={`${pct(t.tasa_glosa)} tasa de glosa`}
        icon={TriangleAlert}
        tone="danger"
      />
    </div>
  );
}
