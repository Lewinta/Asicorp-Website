import { mesLabel, money } from "@/lib/format";
import type { MensualRow } from "@/lib/portal-types";

const PLOT_H = 220; // px

function Bar({
  value, max, colorClass, label,
}: {
  value: number; max: number; colorClass: string; label: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="group relative flex h-full w-1/3 max-w-[16px] items-end justify-center">
      <div
        className={`w-full rounded-t transition-all ${colorClass}`}
        style={{ height: `${pct}%` }}
      />
      {/* Tooltip que aparece al hacer hover mostrando el monto */}
      <div
        className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
        style={{ bottom: `calc(${pct}% + 6px)` }}
      >
        {label}: {money(value)}
      </div>
    </div>
  );
}

export function EvolucionChart({ rows }: { rows: MensualRow[] }) {
  if (rows.length === 0) return null;

  const max = Math.max(
    ...rows.flatMap((r) => [r.facturado, r.desembolsado, r.glosado]),
    1,
  );
  const gridVals = [max, (max * 2) / 3, max / 3, 0];
  const kFmt = (v: number) =>
    v >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`;

  return (
    <div>
      <div className="flex gap-3">
        {/* Eje Y */}
        <div
          className="flex w-9 shrink-0 flex-col justify-between text-right text-[10px] leading-none text-muted-foreground"
          style={{ height: PLOT_H }}
        >
          {gridVals.map((v, i) => (
            <span key={i}>{kFmt(v)}</span>
          ))}
        </div>

        {/* Área de plot */}
        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height: PLOT_H }}>
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {gridVals.map((v, i) => (
                <div
                  key={i}
                  className={`h-px w-full ${v === 0 ? "bg-border" : "bg-border/50"}`}
                />
              ))}
            </div>
            {/* Barras */}
            <div className="relative flex h-full items-end gap-4 px-1">
              {rows.map((r) => (
                <div key={r.mes} className="flex h-full flex-1 items-end justify-center gap-1">
                  <Bar value={r.facturado} max={max} colorClass="bg-primary" label="Facturado" />
                  <Bar value={r.desembolsado} max={max} colorClass="bg-[color:var(--success)]" label="Desembolsado" />
                  <Bar value={r.glosado} max={max} colorClass="bg-[color:var(--danger)]" label="Glosado" />
                </div>
              ))}
            </div>
          </div>
          {/* Etiquetas de mes */}
          <div className="mt-2 flex gap-4 px-1">
            {rows.map((r) => (
              <div key={r.mes} className="flex-1 text-center text-[11px] text-muted-foreground">
                {mesLabel(r.mes)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-primary" />
          Facturado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[color:var(--success)]" />
          Desembolsado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[color:var(--danger)]" />
          Glosado
        </span>
      </div>
    </div>
  );
}
