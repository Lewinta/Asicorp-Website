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

// Los estados y periodicidades de la Línea de Crédito vienen en inglés desde el
// doctype de Frappe; el portal es es-DO, así que se traducen para mostrarse.
export const ESTADO_LINEA_STYLE: Record<string, string> = {
  Active: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  Pending: "bg-primary/15 text-primary",
  Paid: "bg-muted text-muted-foreground",
  Closed: "bg-muted text-muted-foreground line-through",
};

export const ESTADO_LINEA_LABEL: Record<string, string> = {
  Active: "Activa", Pending: "Pendiente", Paid: "Saldada", Closed: "Cerrada",
};

export const AMORTIZACION_LABEL: Record<string, string> = {
  Daily: "Diaria", Weekly: "Semanal", Biweekly: "Quincenal", Monthly: "Mensual",
  Quarterly: "Trimestral", Biannual: "Semestral", Annual: "Anual",
};

export const ESTADO_STYLE: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Desembolsado: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  "Cobro Parcial": "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  Vencido: "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
  Cobrado: "bg-primary/15 text-primary",
  Cerrado: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  Cancelado: "bg-muted text-muted-foreground line-through",
};
