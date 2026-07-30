import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label, value, sub, icon: Icon, tone = "default",
}: {
  label: string; value: string; sub?: string; icon: LucideIcon;
  tone?: "default" | "success" | "danger";
}) {
  const toneClass =
    tone === "success" ? "text-[color:var(--success)]"
    : tone === "danger" ? "text-[color:var(--danger)]"
    : "text-foreground";
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 shrink-0 text-primary" />
      </div>
      <p className={`mt-3 truncate font-display text-xl font-bold leading-tight tabular-nums ${toneClass}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
