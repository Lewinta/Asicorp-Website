export function money(n: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency", currency: "DOP", maximumFractionDigits: 2,
  }).format(n || 0);
}

export function moneyShort(n: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency", currency: "DOP", maximumFractionDigits: 0,
  }).format(n || 0);
}

export function fecha(d: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("es-DO", { dateStyle: "medium" }).format(new Date(d));
}

export function pct(n: number): string {
  return `${(n || 0).toFixed(1)}%`;
}

export function mesLabel(mes: string): string {
  // "2026-03" -> "Mar 26"
  const [y, m] = mes.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${meses[Number(m) - 1] ?? m} ${y.slice(2)}`;
}

export const ESTADO_STYLE: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Desembolsado: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  Vencido: "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
  Cobrado: "bg-primary/15 text-primary",
  Cancelado: "bg-muted text-muted-foreground line-through",
};
