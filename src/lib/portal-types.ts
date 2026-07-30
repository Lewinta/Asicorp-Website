export type LoteRow = {
  name: string;
  fecha: string;
  estado: "Draft" | "Desembolsado" | "Vencido" | "Cobrado" | "Cancelado";
  monto_total: number;
  neto_desembolsar: number;
};

export type PortalSummary = {
  total_desembolsado: number;
  lotes_activos: number;
  saldo_por_cobrar: number;
  proximos_vencimientos: number;
};

export type FacturaRow = {
  fecha: string; referencia: string; ncf: string; cliente: string;
  vencimiento: string; monto: number; cobrado: number; pendiente: number;
};

export type DeduccionRow = {
  deduccion: string; detalle: string; monto: number; tasa: number;
};

export type LoteDetail = {
  name: string; fecha: string; estado: LoteRow["estado"];
  monto_total: number; comision_monto: number; reserva_monto: number;
  impuesto_monto: number; deducciones_totales: number; neto_desembolsar: number;
  facturas: FacturaRow[]; deducciones: DeduccionRow[];
};

export type PortalSession = { cedente: string; customerName: string; email: string };

export type ArsRow = {
  ars: string; facturado: number; neto: number; cobrado: number;
  pendiente: number; glosado: number; tasa_glosa: number; n: number;
};
export type MensualRow = { mes: string; facturado: number; desembolsado: number; glosado: number };

export type PortalResumen = {
  anio_label: string;
  mes_label: string;
  mes: { desembolsado: number; facturado: number; cobrado: number; lotes: number };
  anio: { desembolsado: number; facturado: number; cobrado: number; pendiente: number; lotes: number };
  mensual: MensualRow[];
  proximos_vencimientos: number;
};
export type GlosaRank = { ars: string; glosado: number; tasa: number };
export type PortalAnalytics = {
  totales: {
    facturado: number; neto_desembolsado: number; cobrado: number;
    pendiente: number; glosado: number; tasa_glosa: number;
    n_facturas: number; n_ars: number;
  };
  por_ars: ArsRow[];
  mensual: MensualRow[];
  glosas: { tasa_global: number; total: number; ranking: GlosaRank[] };
};
