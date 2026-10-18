/*
  Contenido comercial de ASICORP. Fuente: "ASICORP Propuesta Servicios v2" (oct 2026).
  Las cifras salen de la propuesta; no se agregan datos que no estén ahí.
*/

export const entidad =
  "ASICORP (Asesores e Interventores Corporativos, S.R.L.) anticipa en 4 días hábiles el total facturado a las ARS por clínicas, centros de diagnóstico, laboratorios y profesionales de la salud en República Dominicana, sin préstamos, garantías ni avales.";

export const cifras = [
  { valor: "+15", etiqueta: "años en el sector salud" },
  { valor: "4", etiqueta: "días hábiles para su anticipo" },
  { valor: "12", etiqueta: "facturaciones y 12 cobros al año" },
  { valor: "0", etiqueta: "garantías ni avales" },
] as const;

export const desafios = [
  { titulo: "Ciclos de pago prolongados", texto: "Capital de trabajo inmovilizado durante meses." },
  { titulo: "Glosas y denegaciones", texto: "Ingresos que se facturan pero no se cobran." },
  { titulo: "Alta carga administrativa", texto: "Radicación, seguimiento y conciliación de pagos." },
  { titulo: "Dependencia del crédito bancario", texto: "Para cubrir nómina, proveedores y gastos." },
] as const;

export type Paso = {
  n: string;
  sello: string;
  titulo: string;
  resumen: string;
  texto: string;
  puntos: readonly string[];
};

export const ciclo: readonly Paso[] = [
  {
    n: "01",
    sello: "Auditado",
    titulo: "Auditoría forense de la facturación",
    resumen: "Detectamos errores antes de radicar.",
    texto:
      "Revisamos minuciosamente sus facturas y reclamaciones médicas, como control adicional a su auditoría interna.",
    puntos: [
      "Detectamos errores u omisiones que generan glosas",
      "Notificación oportuna para su corrección",
      "Facturación depurada antes de la radicación",
    ],
  },
  {
    n: "02",
    sello: "Radicado",
    titulo: "Radicación y gestión ante las ARS",
    resumen: "Radicamos y le entregamos el respaldo.",
    texto:
      "Con la facturación depurada, la radicamos ante cada ARS con la que trabaja su institución.",
    puntos: [
      "Radicación ante cada ARS",
      "Entrega del respaldo de cada radicación",
      "Su equipo se enfoca en atender pacientes",
    ],
  },
  {
    n: "03",
    sello: "Anticipado",
    titulo: "Anticipo de fondos",
    resumen: "En 4 días hábiles, el total facturado.",
    texto:
      "A los 4 días hábiles de recibir sus facturas, le anticipamos el total facturado.",
    puntos: [
      "Liquidez en 4 días hábiles",
      "Total facturado, menos el costo del servicio",
      "No es un préstamo: sin garantías ni avales",
    ],
  },
  {
    n: "04",
    sello: "Conciliado",
    titulo: "Cobranza y conciliación",
    resumen: "Seguimiento y cuadre de cada pago.",
    texto: "Damos seguimiento al cobro ante las ARS y conciliamos cada pago recibido.",
    puntos: [
      "Seguimiento de cobro ante cada ARS",
      "Conciliación partida por partida, sin diferencias",
      "Software especializado, desarrollado para el mercado local",
    ],
  },
];

export const impacto = [
  {
    valor: "x2",
    titulo: "Flujo de caja hasta duplicado en el primer mes",
    texto: "Anticipo del mes corriente más los cobros en curso de meses anteriores.",
  },
  {
    valor: "RD$5M",
    titulo: "En ventas para reponer RD$1M en glosas",
    texto: "Con un margen neto del 20%. La auditoría preventiva reduce ese riesgo.",
  },
  {
    valor: "RD$2.4M",
    titulo: "Ahorro potencial al año",
    texto: "Con compras de RD$12M al contado y descuentos de hasta un 20%.",
  },
] as const;

export const beneficios = [
  { titulo: "Flujo de caja estable", texto: "Mensual y predecible" },
  { titulo: "Un solo desembolso", texto: "El total facturado del mes" },
  { titulo: "Cumplimiento puntual", texto: "Con proveedores y servicios" },
  { titulo: "Compras al contado", texto: "Mejores precios y mayor margen" },
  { titulo: "Menos costos operativos", texto: "Fin de las ventas a crédito" },
  { titulo: "Recursos estratégicos", texto: "Reinvierta en su institución" },
  { titulo: "Sin garantías ni avales", texto: "No constituye un préstamo" },
  { titulo: "Glosas financiadas", texto: "Sin costo adicional" },
] as const;

export const complementarios = [
  {
    titulo: "Análisis de costos de servicios médicos",
    texto: "Personal contable y administrativo con experiencia en costos del sector salud.",
  },
  {
    titulo: "Soporte en negociación tarifaria con las ARS",
    texto: "Revisión y aumento de tarifas, sustentados en estudios de costos rigurosos.",
  },
  {
    titulo: "Auditoría médica",
    texto: "Auditores especialistas en concurrencia, expedientes y conciliación, in situ.",
  },
] as const;

export const tarifa = {
  mensual: { min: 3.5, max: 3.75 },
  porLote: { min: 7.0, max: 7.5, plazoDias: 60 },
  incluye: [
    "Auditoría de las reclamaciones médicas",
    "Gestión operativa ante las ARS",
    "Anticipo del total facturado en el mes",
  ],
} as const;

export const proximosPasos = [
  { titulo: "Reunión de diagnóstico", texto: "Conocemos su operación y su ciclo de facturación." },
  { titulo: "Revisión de facturación", texto: "Analizamos una muestra de sus reclamaciones a las ARS." },
  { titulo: "Propuesta personalizada", texto: "Definimos tarifa y alcance según su volumen." },
  { titulo: "Firma e inicio", texto: "Formalizamos el acuerdo y recibe su primer anticipo." },
] as const;

export const clientesObjetivo = [
  "Clínicas",
  "Centros de diagnóstico",
  "Laboratorios",
  "Profesionales de la salud",
] as const;

export const preguntas = [
  {
    q: "¿Qué es la cesión de crédito de ASICORP?",
    a: "Es un servicio mensual para instituciones de salud: usted factura a las ARS, nosotros auditamos esa facturación, la radicamos, le anticipamos el total facturado en 4 días hábiles y luego cobramos y conciliamos cada pago con las ARS.",
  },
  {
    q: "¿Es un préstamo?",
    a: "No. No constituye un préstamo y no pedimos garantías ni avales. Le anticipamos el total facturado del mes, menos el costo del servicio.",
  },
  {
    q: "¿En cuánto tiempo recibo el dinero?",
    a: "En 4 días hábiles desde la recepción de sus facturas. Como el ciclo se repite cada mes, pasa de unos 9 cobros al año con el ciclo habitual de las ARS a 12 cobros al año.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Entre 3.50% y 3.75% mensual, equivalente a 7.00% a 7.50% por lote de facturas (hasta 60 días). Incluye la auditoría de las reclamaciones, la gestión ante las ARS y el anticipo. La tarifa final se define según el volumen de facturación y el nivel de gestión requerido.",
  },
  {
    q: "¿Qué pasa con las glosas?",
    a: "La auditoría forense detecta antes de radicar los errores u omisiones que generan glosas, y le notificamos a tiempo para corregirlos. Las glosas quedan financiadas sin costo adicional.",
  },
  {
    q: "¿Quién puede contratar el servicio?",
    a: "Clínicas, centros de diagnóstico, laboratorios y profesionales de la salud que facturan a las ARS en República Dominicana.",
  },
  {
    q: "¿Hay un tiempo mínimo de permanencia?",
    a: "No. Puede finalizar el acuerdo en cualquier momento, sin penalidad, con un preaviso de sesenta (60) días.",
  },
] as const;
