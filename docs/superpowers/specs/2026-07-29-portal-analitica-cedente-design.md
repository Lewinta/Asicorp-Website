# Portal de Cedentes ASICORP — Analítica del Cedente

**Fecha:** 2026-07-29
**Estado:** Aprobado (mockup revisado por Lewin), listo para implementar
**Extiende:** [Portal de Cedentes](2026-07-29-portal-cedentes-asicorp-design.md)

## Objetivo

Nueva página **`/portal/analitica`** en el portal del cedente con analítica accionable
sobre su operación de factoring: cuánto factura, cuánta liquidez recibe, cómo va la
cobranza, y **dónde se le glosa** — para que el cedente entienda su negocio y tome
decisiones (reclamar glosas, diversificar ARS). Objetivo de negocio: "crear la necesidad"
de entrar al portal.

## Decisiones (confirmadas con el cliente)

1. **Alcance de datos:** solo lotes **desembolsados** (`docstatus = 1`: estados
   Desembolsado / Vencido / Cobrado). La página arranca vacía (con empty states) hasta que
   existan lotes desembolsados.
2. **Ganancia = ambos:** mostrar **facturado bruto** y **neto recibido** (liquidez), para
   que el cedente vea el costo del factoring.
3. **Ubicación:** página dedicada `/portal/analitica`, nuevo ítem en el menú lateral. El
   dashboard actual (`/portal`) queda como resumen rápido.
4. **Alcance v1:** KPIs + Desempeño por ARS + Evolución mensual + Foco de glosas.
   (Insights autogenerados → v2.)

## Datos disponibles (verificado)

De los lotes del cedente (`docstatus=1`) y sus tablas hijas:
- **Facturas por Cobrar** (child de Lote): `cliente` (ARS/deudor), `monto` (facturado),
  `cobrado`, `glosado`, `pendiente`, `fecha`, `vencimiento`.
- **Lote**: `fecha`, `monto_total`, `neto_desembolsar`, `comision_monto`, `impuesto_monto`,
  `glosado_total`, `estado`.

Ejemplo real (ANGELHO, agregado por ARS): SENASA facturado 264,380 / pendiente 178,320;
PRIMERA 25,490 / 16,724; Humano 15,717 / 10,411.

## Backend — nuevo endpoint

`asicorp/api.py` -> `@frappe.whitelist() def get_portal_analytics(cedente)`.
Valida el cedente (`_assert_cedente`, igual que los demas). Agrega **solo** lotes con
`docstatus=1`. Devuelve:

```json
{
  "totales": {
    "facturado": 0, "neto_desembolsado": 0, "cobrado": 0, "pendiente": 0,
    "glosado": 0, "tasa_glosa": 0.0, "n_facturas": 0, "n_ars": 0
  },
  "por_ars": [
    { "ars": "ARS SENASA", "facturado": 0, "neto": 0, "cobrado": 0,
      "pendiente": 0, "glosado": 0, "tasa_glosa": 0.0, "n": 0 }
  ],
  "mensual": [ { "mes": "2026-01", "facturado": 0, "desembolsado": 0 } ],
  "glosas": {
    "tasa_global": 0.0, "total": 0,
    "ranking": [ { "ars": "ARS SENASA", "glosado": 0, "tasa": 0.0 } ]
  }
}
```

**Computo:**
- `facturado/cobrado/glosado/pendiente` = `sum` de los campos de Facturas por Cobrar,
  globales y agrupados por `cliente` (ARS).
- `neto_desembolsado` (total) = `sum(lote.neto_desembolsar)` (exacto).
- `por_ars.neto` = **prorrateado**: por cada factura, `(factura.monto / lote.monto_total) *
  lote.neto_desembolsar`, sumado por ARS. (El neto es a nivel de lote; se asigna a cada ARS
  en proporcion a lo facturado. Se documenta como aproximacion.)
- `mensual` = agrupado por mes de `lote.fecha`: `facturado` (sum monto facturas) y
  `desembolsado` (sum neto_desembolsar). Ordenado ascendente; ultimos 12 meses.
- `tasa_glosa` = `glosado / facturado` (0 si facturado=0).
- `glosas.ranking` = `por_ars` ordenado por `glosado` desc.

Un solo query agregado sobre `tabFacturas por Cobrar` join `tabLote` (con `docstatus=1`)
cubre casi todo; el prorrateo de neto y la serie mensual se calculan en Python sobre los
lotes. Rendimiento: un cedente tiene decenas-cientos de facturas; trivial.

## Frontend

- **Menu:** agregar `{ href: "/portal/analitica", label: "Analitica", icon: LineChart }` al
  nav del `PortalShell` (entre "Mis lotes" y "Configuracion").
- **Ruta:** `src/app/portal/(app)/analitica/page.tsx` (server component, `dynamic="force-dynamic"`),
  consume `fetchAnalytics()` (nuevo helper en `portal-data.ts`) -> `get_portal_analytics`.
- **Tipos:** `PortalAnalytics` y subtipos en `portal-types.ts`.
- **Componentes** (`src/components/portal/analitica/`):
  - `analitica-kpis.tsx` — fila de 5 KPIs (facturado, neto, cobrado, pendiente, glosado+%).
  - `ars-table.tsx` — tabla Desempeno por ARS con barra de facturacion y pill de % glosa
    (verde/ambar/rojo por umbral).
  - `evolucion-chart.tsx` — barras agrupadas SVG (facturado vs desembolsado por mes).
  - `glosa-focus.tsx` — % glosa grande, ranking de ARS, y **alerta** cuando algun ARS supera
    la tasa de glosa promedio (texto derivado en el cliente).
- **Estetica:** tokens del portal (globals.css); graficos **SVG hechos a mano** (sin libreria
  de charts). Sin emoji (iconos lucide-react / SVG inline). Color semantico: verde=liquidez,
  rojo=glosa, separado del azul de marca.
- **Empty states:** si `totales.n_facturas === 0`, cada bloque muestra un mensaje tipo
  "Aqui veras [X] cuando tengas tu primer lote desembolsado" en vez de ceros.

## Seguridad y despliegue

- El endpoint se llama via el BFF con la cuenta de servicio, scoped al `cedente` de la sesion
  (mismo patron que los demas endpoints del portal). El navegador nunca toca el ERP.
- Deploy: backend (`api.py` + `bench restart` en el ERP) y frontend (build + `pm2 restart` en
  el servidor web), en la rama `feature/fullpage-scroll` que esta en produccion.

## Fuera de alcance (v1)

- Insights autogenerados en prosa (mas alla de la alerta de glosa).
- Filtros por rango de fecha / por ARS (se puede anadir despues).
- Exportar a PDF/Excel.
- Composicion de cobranza en donut (se puede anadir; no en v1).
