import { TriangleAlert } from "lucide-react";
import { money, pct } from "@/lib/format";
import type { PortalAnalytics } from "@/lib/portal-types";

export function GlosaFocus({
  glosas,
  facturado,
}: {
  glosas: PortalAnalytics["glosas"];
  facturado: number;
}) {
  if (glosas.total === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Aún no tienes glosas registradas. Cuando una ARS rechace parte de una factura, la verás aquí.
      </p>
    );
  }

  const ranking = glosas.ranking.filter((r) => r.glosado > 0);
  const maxGlosado = Math.max(...ranking.map((r) => r.glosado), 1);
  const topArs = ranking[0];
  const showAlert = !!topArs && topArs.tasa > glosas.tasa_global;

  return (
    <div className="grid items-center gap-7 lg:grid-cols-2">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold tracking-tight text-[color:var(--danger)] tabular-nums">
            {pct(glosas.tasa_global)}
          </span>
          <span className="text-xs text-muted-foreground">
            de tu facturación total fue glosada
            <br />
            ({money(glosas.total)} sobre {money(facturado)})
          </span>
        </div>
        {showAlert && (
          <div className="mt-4 flex gap-2.5 rounded-xl border border-[color:var(--danger)]/25 bg-[color:var(--danger)]/[0.09] p-3.5 text-xs">
            <TriangleAlert className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[color:var(--danger)]" />
            <div>
              Tu tasa de glosa con{" "}
              <b className="text-[color:var(--danger)]">
                {topArs.ars} ({pct(topArs.tasa)})
              </b>{" "}
              está por encima de tu promedio. Concentra ahí tu reclamación.
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {ranking.map((r) => (
          <div
            key={r.ars}
            className="grid grid-cols-[96px_1fr_auto] items-center gap-2.5 text-xs"
          >
            <span className="truncate text-muted-foreground">{r.ars}</span>
            <span className="h-2 rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-[color:var(--danger)]"
                style={{ width: `${(r.glosado / maxGlosado) * 100}%` }}
              />
            </span>
            <b className="tabular-nums text-foreground">{money(r.glosado)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
