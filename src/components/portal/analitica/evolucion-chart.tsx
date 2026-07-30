import { mesLabel, money } from "@/lib/format";
import type { MensualRow } from "@/lib/portal-types";

const PLOT_H = 220; // px

export function EvolucionChart({ rows }: { rows: MensualRow[] }) {
  if (rows.length === 0) return null;

  const max = Math.max(...rows.flatMap((r) => [r.facturado, r.desembolsado]), 1);
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
                <div key={r.mes} className="flex h-full flex-1 items-end justify-center gap-1.5">
                  <div
                    title={`Facturado: ${money(r.facturado)}`}
                    className="w-1/2 max-w-[20px] rounded-t bg-primary transition-all"
                    style={{ height: `${(r.facturado / max) * 100}%` }}
                  />
                  <div
                    title={`Desembolsado: ${money(r.desembolsado)}`}
                    className="w-1/2 max-w-[20px] rounded-t bg-[color:var(--success)] transition-all"
                    style={{ height: `${(r.desembolsado / max) * 100}%` }}
                  />
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
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-primary" />
          Facturado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[color:var(--success)]" />
          Desembolsado
        </span>
      </div>
    </div>
  );
}
