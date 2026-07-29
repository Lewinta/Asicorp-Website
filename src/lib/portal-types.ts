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
  fecha: string; referencia: string; ncf: string;
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
