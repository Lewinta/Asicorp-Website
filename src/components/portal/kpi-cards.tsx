import { Banknote, FileStack, Wallet, CalendarClock } from "lucide-react";
import { money } from "@/lib/format";
import type { PortalSummary } from "@/lib/portal-types";

export function KpiCards({ s }: { s: PortalSummary }) {
  const items = [
    { label: "Total desembolsado", value: money(s.total_desembolsado), icon: Banknote },
    { label: "Lotes activos", value: String(s.lotes_activos), icon: FileStack },
    { label: "Saldo por cobrar", value: money(s.saldo_por_cobrar), icon: Wallet },
    { label: "Próximos vencimientos", value: String(s.proximos_vencimientos), icon: CalendarClock },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{i.label}</p>
            <i.icon className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-foreground">{i.value}</p>
        </div>
      ))}
    </div>
  );
}
