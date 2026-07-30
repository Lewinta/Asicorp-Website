import { mesLabel } from "@/lib/format";
import type { MensualRow } from "@/lib/portal-types";

export function EvolucionChart({ rows }: { rows: MensualRow[] }) {
  if (rows.length === 0) return null;

  const W = 400;
  const H = 210;
  const axisX = 34;        // left gutter for y labels
  const baseY = 170;       // baseline y
  const topY = 20;         // top of plot area
  const plotH = baseY - topY;
  const plotW = W - axisX - 8;

  const max = Math.max(...rows.flatMap((r) => [r.facturado, r.desembolsado]), 1);
  const slot = plotW / rows.length;
  const barW = Math.min(16, slot / 3);
  const gap = 2;

  const y = (v: number) => baseY - (v / max) * plotH;

  // gridlines at 0, 1/3, 2/3, 3/3 of max
  const gridVals = [0, max / 3, (max * 2) / 3, max];

  const kFmt = (v: number) =>
    v >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[210px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Facturado y desembolsado por mes"
      >
        <g stroke="var(--border)" strokeWidth="1">
          {gridVals.map((v, i) => (
            <line
              key={i}
              x1={axisX}
              y1={y(v)}
              x2={W - 8}
              y2={y(v)}
              opacity={v === 0 ? 1 : 0.5}
            />
          ))}
        </g>
        <g fill="var(--muted-foreground)" fontSize="9" textAnchor="end">
          {gridVals.map((v, i) => (
            <text key={i} x={axisX - 4} y={y(v) + 3}>
              {kFmt(v)}
            </text>
          ))}
        </g>
        <g>
          {rows.map((r, i) => {
            const cx = axisX + slot * i + slot / 2;
            const x1 = cx - barW - gap / 2;
            const x2 = cx + gap / 2;
            return (
              <g key={r.mes}>
                <rect
                  x={x1}
                  y={y(r.facturado)}
                  width={barW}
                  height={baseY - y(r.facturado)}
                  rx="2"
                  fill="var(--primary)"
                />
                <rect
                  x={x2}
                  y={y(r.desembolsado)}
                  width={barW}
                  height={baseY - y(r.desembolsado)}
                  rx="2"
                  fill="var(--success)"
                />
              </g>
            );
          })}
        </g>
        <g fill="var(--muted-foreground)" fontSize="9" textAnchor="middle">
          {rows.map((r, i) => (
            <text key={r.mes} x={axisX + slot * i + slot / 2} y={baseY + 14}>
              {mesLabel(r.mes)}
            </text>
          ))}
        </g>
      </svg>
      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
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
