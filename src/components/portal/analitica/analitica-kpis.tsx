import { FileText, Banknote, Check, Clock, TriangleAlert } from "lucide-react";
import { money, pct } from "@/lib/format";
import type { PortalAnalytics } from "@/lib/portal-types";

export function AnaliticaKpis({ t }: { t: PortalAnalytics["totales"] }) {
  const items = [
    {
      label: "Total facturado",
      value: money(t.facturado),
      sub: `${t.n_facturas} facturas · ${t.n_ars} ARS`,
      icon: FileText,
      valueClass: "text-foreground",
    },
    {
      label: "Neto desembolsado",
      value: money(t.neto_desembolsado),
      sub: "liquidez recibida",
      icon: Banknote,
      valueClass: "text-[color:var(--success)]",
    },
    {
      label: "Cobrado",
      value: money(t.cobrado),
      sub: "cobrado a las ARS",
      icon: Check,
      valueClass: "text-foreground",
    },
    {
      label: "Pendiente",
      value: money(t.pendiente),
      sub: "por cobrar a las ARS",
      icon: Clock,
      valueClass: "text-foreground",
    },
    {
      label: "Glosado",
      value: money(t.glosado),
      sub: `${pct(t.tasa_glosa)} tasa de glosa`,
      icon: TriangleAlert,
      valueClass: "text-[color:var(--danger)]",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {items.map((i) => (
        <div key={i.label} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{i.label}</p>
            <i.icon className="h-5 w-5 text-primary" />
          </div>
          <p className={`mt-3 font-display text-2xl font-bold tabular-nums ${i.valueClass}`}>{i.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{i.sub}</p>
        </div>
      ))}
    </div>
  );
}
