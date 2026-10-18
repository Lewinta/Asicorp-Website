export type LoteRow = {
  name: string;
  fecha: string;
  estado: "Draft" | "Desembolsado" | "Cobro Parcial" | "Vencido" | "Cobrado" | "Cerrado" | "Cancelado";
  monto_total: number;
  neto_desembolsar: number;
  cobrado: number;
  glosado: number;
};

export type PortalSummary = {
  total_desembolsado: number;
  lotes_activos: number;
  saldo_por_cobrar: number;
  proximos_vencimientos: number;
};

export type FacturaRow = {
  fecha: string; referencia: string; ncf: string; cliente: string;
  vencimiento: string; monto: number; cobrado: number; cobrado_por_cedente: number;
  glosado: number; pendiente: number;
};

export type DeduccionRow = {
  deduccion: string; detalle: string; monto: number; tasa: number;
};

export type RecobroRow = {
  lote_origen: string; factura_referencia: string; cliente: string;
  tipo: string; resolucion: string; monto_glosa: number; monto_recobro: number;
};

export type DevolucionRow = { descripcion: string; monto: number };

// Recobros y devoluciones son campos nuevos del endpoint: los lotes viejos pueden
// no traerlos, así que son opcionales y la vista los trata como vacíos / 0.
export type LoteDetail = {
  name: string; fecha: string; estado: LoteRow["estado"];
  monto_total: number; comision_monto: number; reserva_monto: number;
  impuesto_monto: number; deducciones_totales: number; neto_desembolsar: number;
  facturas: FacturaRow[]; deducciones: DeduccionRow[];
  recobro_monto?: number; linea_conversion_monto?: number; devoluciones_totales?: number;
  recobros?: RecobroRow[]; devoluciones?: DevolucionRow[];
};

export type PortalSession = { cedente: string; customerName: string; email: string };

export type LineaEstado = "Active" | "Pending" | "Paid" | "Closed";

export type AmortizacionTipo =
  | "Daily" | "Weekly" | "Biweekly" | "Monthly"
  | "Quarterly" | "Biannual" | "Annual";

export type LineaCreditoRow = {
  name: string;
  posting_date: string;
  status: LineaEstado;
  credit_amount: number;
  used_amount: number;
  available_amount: number;
  outstanding_amount: number;
  annual_rate: number;
  amortization_type: AmortizacionTipo;
  next_amortization: string | null;
};

/**
 * Una fila de la tabla de amortización: un pago recibido y su reparto.
 * `referencia` es el comprobante que ve el cedente (`reference_name` del ledger
 * si lo hay, si no el `name` del propio asiento).
 */
export type PagoLinea = {
  posting_date: string;
  referencia: string;
  capital: number;
  interes: number;
  total: number;
  saldo_despues: number;
};

/** Un asiento del ledger que consumió la línea. */
export type MovimientoLinea = {
  posting_date: string;
  entry_type: string;
  amount: number;
  reference_type: string | null;
  reference_name: string | null;
  comment: string;
  amount_after_transaction: number;
};

export type LineaCreditoDetail = LineaCreditoRow & {
  interest_amount: number;
  payments: number;
  last_amortization: string | null;
  pagos: PagoLinea[];
  movimientos: MovimientoLinea[];
  totales: { capital: number; interes: number; pagado: number };
};

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
