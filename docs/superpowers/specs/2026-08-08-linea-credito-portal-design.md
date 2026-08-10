# Línea de Crédito en el Portal del Cedente — Diseño

**Fecha:** 2026-08-08
**App:** `asicorp-website` (portal de cedentes, `asicorprd.com/portal`)

## Objetivo

Dar al cedente una sección propia para su financiamiento por línea de crédito,
análoga a la de Lotes: cuánto tiene aprobado, cuánto le queda disponible, qué ha
pagado y cómo se repartió cada pago entre capital e interés.

## Alcance en dos fases

**Fase 1 (este spec):** las pantallas completas contra *dummy data*, para validar
el layout. No se toca el ERP.

**Fase 2 (después):** se sustituye el mock por llamadas reales a Frappe. Requiere
cambios en la app `asicorp` que se detallan en "Pendiente en Frappe".

La separación existe porque el desglose capital/interés **todavía no existe en el
ERP** y no queremos que esa dependencia bloquee la validación del diseño.

## Estado actual del ERP (verificado el 2026-08-08)

Los doctypes ya existen en el módulo `Factoraje`:

**`Linea de Credito`** (submittable) — `party` (Link a Customer, es el cedente),
`posting_date`, `status` (Select: `Active` / `Pending` / `Paid` / `Closed`),
`annual_rate` (Percent), `amortization_type` (Select: `Daily` / `Weekly` /
`Biweekly` / `Monthly` / `Quarterly` / `Biannual` / `Annual`), `next_amortization`,
`last_amortization`, `credit_amount`, `used_amount`, `interest_amount`, `payments`,
`available_amount`, `outstanding_amount`.

**`Linea de Credito Ledger`** (doctype normal, no child table) — `posting_date`,
`amount`, `entry_type` (Data, texto libre), `credit_line` (Link), `reference_type`
(Select: `Lote` / `Journal Entry`), `reference_name` (Dynamic Link),
`amount_after_transaction`, `comment`.

Hay un registro real, `CL-00001`, del cedente `SANDY ALBERTO RODRIGUEZ HERNANDEZ`:
`credit_amount` 9,675.00 · `used_amount` 9,675.00 · `available_amount` 0.00 ·
`outstanding_amount` 9,675.00 · `annual_rate` 42% · `amortization_type` Monthly ·
`status` Pending. Su único asiento en el ledger es `entry_type: "Credit"` por
9,675.00 con referencia al Lote `LOT-26-00490` y comentario *"Conversión de vencido
a línea"*: la línea nació de convertir un lote vencido.

**El ledger no tiene desglose capital/interés.** Es la única pieza del diseño sin
respaldo en el ERP.

## Decisiones

**Sin mora.** El producto es una línea de crédito: mientras haya saldo pendiente
simplemente se generan más intereses. No existe un cargo por mora separado, así que
no hay columna de mora, ni total de mora, ni campo de mora que pedirle a Frappe. El
desglose es de dos vías: **capital e interés**.

**Varias líneas por cedente.** Un cedente puede tener más de una línea abierta a la
vez (p. ej. una por cada lote vencido convertido), así que la sección es
listado + detalle, igual que Lotes, y no una página única.

**El desglose es de pagos reales, no una proyección.** La tabla muestra una fila por
pago recibido con su reparto real entre capital e interés, no un calendario de
cuotas calculado. Esto implica que el dato tiene que venir del ERP; no se puede
derivar en el portal.

**Los tipos calcan los nombres de campo de Frappe** (`credit_amount`,
`available_amount`, `outstanding_amount`, `annual_rate`…). Así la fase 2 es
sustituir el cuerpo de dos funciones, sin tocar páginas ni componentes.

## Rutas y navegación

```
/portal/lineas          listado
/portal/lineas/[name]   detalle
```

Nuevo item en `src/components/portal/nav-items.ts`: label **"Líneas de crédito"**,
icono `CreditCard` (lucide), ubicado entre *Mis lotes* y *Analítica*. `isNavActive`
ya resuelve el estado activo por `startsWith`, no requiere cambios.

## Pantalla de listado

Estructura idéntica a *Mis lotes*: encabezado y tabla, sin tarjetas de KPI.

| Columna | Origen |
|---|---|
| Línea | `name`, enlaza a `/portal/lineas/[name]` |
| Fecha | `posting_date` |
| Estado | `status`, badge de color |
| Monto línea | `credit_amount` |
| Usado | `used_amount` |
| Disponible | `available_amount` |
| Saldo pendiente | `outstanding_amount`, en negrita |

Estado vacío: *"Aún no tienes líneas de crédito."*, con el mismo recuadro punteado
que usa `LotesTable`.

## Pantalla de detalle

Sigue el orden de `lotes/[name]/page.tsx`:

1. Enlace **← Volver a mis líneas**.
2. Encabezado: `name` grande, `posting_date` debajo, badge de estado a la derecha.
3. **Aviso de cuota vencida** — solo si `next_amortization` es anterior a hoy.
   Mismo tratamiento visual que el aviso de notificaciones deshabilitadas de
   Configuración (fondo `--danger` al 10%, icono `AlertTriangle`).
4. Grid de dos tarjetas:
   - Tarjeta primaria con el número grande: **Balance disponible**
     (`available_amount`). Es el dato accionable — lo que el cedente todavía puede
     usar. El monto aprobado va en la ficha de al lado, no aquí.
   - Ficha de datos: Monto de la línea, Usado, Saldo pendiente, Interés acumulado
     (`interest_amount`), Tasa anual, Amortización, Próxima cuota.
5. Sección **Pagos** — la tabla de amortización.
6. Sección **Movimientos de la línea** — de dónde salió la deuda.

### Tabla de Pagos

| Columna | Campo |
|---|---|
| Fecha | `posting_date` |
| Referencia | `referencia` |
| Capital | `capital` |
| Interés | `interes` |
| Total | `total` |
| Saldo después | `saldo_despues` |

Con `tfoot` de totales acumulados (capital, interés, total pagado) desde la apertura
de la línea. Estado vacío: *"Aún no se han registrado pagos en esta línea."*

### Tabla de Movimientos

| Columna | Campo |
|---|---|
| Fecha | `posting_date` |
| Concepto | `entry_type` |
| Referencia | `reference_name`; si `reference_type === "Lote"`, enlaza a `/portal/lotes/[reference_name]` |
| Monto | `amount` |
| Saldo después | `amount_after_transaction` |

El `comment` se muestra como línea secundaria bajo la referencia. Esta tabla es la
que responde "¿por qué debo esto?", que es la primera pregunta del cedente cuando la
línea vino de un lote vencido convertido.

## Contrato de datos

En `src/lib/portal-types.ts`:

```ts
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
 * `referencia` es el identificador del asiento que el cedente ve como
 * comprobante del pago: `reference_name` del ledger si lo hay, y si no, el
 * `name` del propio asiento.
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
```

## Capa de datos

`src/lib/portal-data.ts` gana dos funciones con la misma forma que las de Lotes:

```ts
export async function fetchLineas(): Promise<LineaCreditoRow[]>
export async function fetchLineaDetail(linea: string): Promise<LineaCreditoDetail>
```

En fase 1 leen de `src/lib/linea-credito-mock.ts`. En fase 2 su cuerpo pasa a ser un
`frappeCall(...)` con `cedente` de la sesión, idéntico al patrón existente, y el
módulo mock se borra. Las páginas nunca cambian.

El mock incluye tres líneas para cubrir los estados de pantalla:

- `CL-00001` — calcada de la real: agotada (`available_amount` 0), `status`
  `Pending`, sin pagos aún, un solo movimiento originado en `LOT-26-00490`.
- `CL-00002` — `Active`, parcialmente usada, con tres pagos que ejercitan la tabla
  de amortización y los totales.
- `CL-00003` — `Paid`, saldada, para verificar el badge y el saldo en cero.

Al menos una línea debe tener `next_amortization` en el pasado, para poder ver el
aviso de cuota vencida.

## Formato y etiquetas

En `src/lib/format.ts`:

- `ESTADO_LINEA_STYLE` — badge por estado: `Active` en `--success`, `Pending` en
  `--primary`, `Paid` en muted, `Closed` en muted.
- `ESTADO_LINEA_LABEL` — los estados vienen en inglés del ERP y el portal es
  es-DO: `Active`→Activa, `Pending`→Pendiente, `Paid`→Saldada, `Closed`→Cerrada.
- `AMORTIZACION_LABEL` — `Daily`→Diaria, `Weekly`→Semanal, `Biweekly`→Quincenal,
  `Monthly`→Mensual, `Quarterly`→Trimestral, `Biannual`→Semestral, `Annual`→Anual.

Se reusan `money()`, `fecha()` y `pct()` sin cambios.

## Archivos

**Nuevos**
- `src/app/portal/(app)/lineas/page.tsx`
- `src/app/portal/(app)/lineas/[name]/page.tsx`
- `src/components/portal/lineas-table.tsx`
- `src/components/portal/linea-pagos-table.tsx`
- `src/components/portal/linea-movimientos-table.tsx`
- `src/lib/linea-credito-mock.ts` *(se borra en fase 2)*

**Modificados**
- `src/lib/portal-types.ts` — los tipos de arriba
- `src/lib/portal-data.ts` — `fetchLineas`, `fetchLineaDetail`
- `src/lib/format.ts` — los tres mapas de etiquetas
- `src/components/portal/nav-items.ts` — el item de navegación

Las tablas van en componentes propios y no inline en las páginas, siguiendo el
patrón de `LotesTable`: cada tabla se entiende y se cambia por separado, y las
páginas quedan en el rol de obtener datos y componer.

## Pendiente en Frappe (fase 2)

- **Dos campos `Currency` en `Linea de Credito Ledger`**: `capital_amount` e
  `interest_amount`, para el reparto de cada pago. Es el único dato del diseño que
  hoy no existe en el ERP.
- **Definir cómo se separa un pago de un consumo.** Las dos tablas del detalle
  —Pagos y Movimientos— salen del mismo ledger, y hoy lo único que las distinguiría
  es `entry_type`, que es un campo `Data` de texto libre (el único valor observado
  es `"Credit"`). Antes de integrar hay que fijar el criterio: o se acuerda un
  conjunto cerrado de valores de `entry_type` y se convierte el campo a Select, o se
  usa el signo de `amount`. Sin esa definición, `get_portal_linea_detail` no puede
  repartir los asientos entre las dos tablas de forma confiable.
- **Dos métodos whitelisted en `asicorp/api.py`**: `get_portal_lineas(cedente)` y
  `get_portal_linea_detail(cedente, linea)`. Ambos con `_assert_cedente(cedente)` y,
  el segundo, validando `doc.party == cedente` antes de devolver nada — mismo patrón
  de autorización que `get_portal_lote_detail`.
- **Revisar `amount_after_transaction`**: en el único asiento existente vale `0.0`
  con `amount: 9675.0`. Si eso alimenta la columna "Saldo después", saldrá mal.

## Fuera de alcance

- Proyección o calendario de cuotas futuras.
- Pagar en línea, pasarela o cualquier acción de escritura.
- Cambios en el ERP durante la fase 1.
- Mora, cargos por atraso y cualquier concepto fuera de capital e interés.

## Criterios de aceptación

1. `/portal/lineas` lista las tres líneas del mock con sus badges de estado y
   enlaza al detalle de cada una.
2. `/portal/lineas/[name]` muestra balance disponible, monto, usado, saldo, interés
   acumulado, tasa, periodicidad y próxima cuota.
3. La tabla de pagos muestra el reparto capital/interés por pago y una fila de
   totales que cuadra con la suma de las columnas.
4. Una referencia de movimiento con `reference_type === "Lote"` enlaza al detalle
   del lote y ese enlace funciona.
5. El aviso de cuota vencida aparece solo en la línea con `next_amortization` en el
   pasado.
6. Una línea sin pagos muestra el estado vacío, no una tabla con encabezados sueltos.
7. `npm run build` pasa sin errores de TypeScript. (`npm run lint` está roto a nivel
   de repo por un fallo de `minimatch` en ESLint 9.39.4, ajeno a este trabajo.)
8. Ninguna página importa del módulo mock directamente: todas pasan por
   `portal-data.ts`.
