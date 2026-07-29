# Portal de Cedentes ASICORP — Diseño

**Fecha:** 2026-07-29
**Autor:** TZCode (Lewin Villar)
**Estado:** Aprobado, listo para plan de implementación

## Objetivo

Convertir el sitio representativo `asicorprd.com` (Next.js SSR) en un portal donde los
**cedentes** de ASICORP inicien sesión y vean un dashboard con su cuenta de factoring:
sus **Lotes**, KPIs, detalle de cada lote e historial/documentos. El cedente puede
configurar un **correo de notificación** para recibir aviso cuando se genere un
**desembolso** en el ERP.

Modelo de referencia visual: el portal de `coopdinamica.tzcode.tech` (mismo stack), pero
con **datos reales** desde Frappe en vez de mock/localStorage.

## Hechos verificados (estado actual)

### ERP — `erp.asicorprd.com` (SSH: OVM2, 150.136.10.32, ubuntu)
- Frappe 14.56.1 / ERPNext 14.50.0, bench en `~/frappe-bench/`.
- App custom **`asicorp` 0.0.1** instalada (con `hooks.py`) — aquí van los endpoints y el hook.
- App **`factoraje`** contiene el doctype **`Lote`**:
  - `autoname: format:LOT-{YY}-{#####}`, **submittable** (docstatus / amended_from).
  - `cedente` → **Link a `Customer`** (obligatorio).
  - `acuerdo` → Link a `Acuerdo de Factoraje`.
  - `estado` (Select): `Draft, Desembolsado, Vencido, Cobrado, Cancelado`.
  - `financiador_tipo`: `Interno / Externo`.
  - Tablas hijas: `facturas_por_cobrar` (Facturas por Cobrar), `deducciones`, `recobros`.
  - Totales: `monto_total`, `comision_monto`, `reserva_monto`, `impuesto_monto`,
    `recobro_monto`, `deducciones_totales`, **`neto_desembolsar`** (neto a transferir al cedente).
  - **`Lote.on_submit()`** arma el Journal Entry de desembolso y hace
    `db_set("estado", "Desembolsado")`. **Este es el momento exacto en que "se genera el
    desembolso"** → punto de disparo de la notificación.
- Existe también una app `factoring`/`tz_factoring` (inglés) con `disbursement`, `seller`, etc.
  **No se usa aquí**: ASICORP opera sobre `factoraje` + `Lote`.

### Sitio web — `asicorprd.com` (SSH: root@95.111.229.40)
- App **Next.js 16 SSR** en `/root/asicorp-website`, corriendo bajo **PM2** (proceso `asicorp`,
  modo fork) detrás de **nginx** (`/etc/nginx/sites-available/asicorp`). Hay un `CLAUDE.md` de
  despliegue en `/root/`.
- Permite añadir rutas `/portal`, route handlers (API), cookies de sesión y server components.

### Repo local `asicorp-website/` (Next.js 16, React 19, Tailwind 4)
- Stack: `next 16.2.9`, `react 19.2.4`, `motion`, `gsap`, `lenis`, `lucide-react`,
  `tailwind-merge`, `class-variance-authority`. Marca: azul `#2C59A4`, Bricolage Grotesque.
- Páginas actuales: `/` (home), `/nosotros`, `/servicios`, `/contacto`, `/evaluacion`.
- Aún **no** hay portal. El portal de `coopdinamica-website` (mismo autor) tiene el shell de
  referencia en `src/app/portal/*` y `src/components/portal/*` (login split-screen, store,
  charts) — pero es cliente puro con `DEMO_USERS`/localStorage.

## Decisiones de producto (confirmadas con el cliente)

1. **Acceso del cedente:** correo + invitación. Los cedentes **no** tienen usuario aún;
   ASICORP los habilita creando un Website User ligado a su Customer y enviando invitación
   para fijar contraseña. Login con **correo + contraseña**.
2. **Alcance del dashboard v1:** Resumen/KPIs + Lista de lotes + Detalle de lote +
   Historial/documentos.
3. **Notificación:** el **cedente configura su propio correo** en el portal (guardado en
   Frappe). Por ahora **solo email**. WhatsApp queda como futuro (`frappe_whatsapp` disponible).

## Arquitectura

```
Navegador del cedente (solo ve asicorprd.com; nunca toca el ERP)
        v
Next.js @ asicorprd.com (PM2)
  |- Portal UI            /portal, /portal/lotes/[name], /portal/configuracion, /portal/login
  |- BFF (route handlers) /api/portal/login, /api/portal/logout
        |  server-to-server con API key de cuenta de servicio
        v
Frappe @ erp.asicorprd.com
  |- app `asicorp`: metodos @whitelist + doc_event Lote.on_submit  ->  doctype `Lote`
```

**Principio de seguridad:** el ERP nunca se expone al navegador. El portal Next.js es un
**BFF**: autentica al cedente, guarda una sesión firmada en cookie httpOnly, y lee datos de
Frappe con una **cuenta de servicio**, **re-filtrando siempre por el cedente de la sesión en
el servidor**. El navegador jamás recibe tokens de Frappe.

## Autenticación

- **Identidad en Frappe:** cedente = **Website User** ligado por **Contact -> Customer**
  (patrón estándar de portal), con rol restringido `Cedente`.
- **Onboarding:** método whitelisted `create_portal_user(customer, email)` crea el Website
  User + enlace al Customer y dispara la invitación de Frappe (el cedente fija su contraseña).
  Invocable desde un botón en el Customer o manualmente.
- **Login:** `/portal/login` -> `POST /api/portal/login`. El BFF verifica credenciales contra
  Frappe (`/api/method/login`). Si es válido, resuelve el Customer del cedente
  (`get_portal_profile`) y **emite su propia sesión firmada** con **iron-session** (cookie
  httpOnly, Secure, SameSite=Lax en `asicorprd.com`). Sin cookies cross-subdominio.
- **Datos posteriores:** el BFF llama a Frappe con la **cuenta de servicio**
  (api_key/secret, rol restringido). Cada método valida el cedente de la sesión -> un cedente
  jamás ve lotes de otro.
- **Protección de rutas:** middleware Next.js protege `/portal/*` (redirige a login sin sesión
  válida). `/portal/login` queda público.

## Backend Frappe — app `asicorp`

### `asicorp/api.py` (todo `@frappe.whitelist()`)

| Método | Acceso | Función |
|---|---|---|
| `create_portal_user(customer, email)` | Admin/System Manager | Crea Website User + Contact->Customer, rol `Cedente`, envía invitación |
| `get_portal_profile(email)` | Servicio | Resuelve `{ customer, customer_name }` del email (tras login) |
| `get_portal_summary(cedente)` | Servicio | KPIs: total desembolsado, N.o lotes activos, saldo por cobrar, próximos vencimientos |
| `get_portal_lotes(cedente, estado?)` | Servicio | Lista de lotes del cedente (fecha, estado, monto_total, neto_desembolsar) |
| `get_portal_lote_detail(cedente, lote)` | Servicio | Detalle; **valida `lote.cedente == cedente`**: facturas, deducciones, totales |
| `get_notification_email(cedente)` | Servicio | Lee el correo de notificación |
| `set_notification_email(cedente, email)` | Servicio | Guarda el correo de notificación (valida formato) |

Todos los métodos "Servicio" validan que el `cedente` recibido corresponde a la sesión (el BFF
lo pasa desde la cookie firmada; la cuenta de servicio no debe permitir listar cedentes
arbitrarios sin ese scope).

### Almacenamiento del correo de notificación
Custom fields en **Customer**, enviados como *fixtures* de la app `asicorp` (sin doctype nuevo):
- `portal_notification_email` (Data)
- `portal_enabled` (Check)

### Notificación de desembolso
En `asicorp/hooks.py`:
```python
doc_events = {"Lote": {"on_submit": "asicorp.api.notify_desembolso"}}
```
`notify_desembolso(doc, method)`: lee `Customer.portal_notification_email` del `doc.cedente`;
si existe y `portal_enabled`, envía `frappe.sendmail` con lote, fecha y `neto_desembolsar`.
Idempotente respecto al submit (on_submit corre una vez).

### Cuenta de servicio y rol
- Rol `Cedente` (restringido; Website User).
- Usuario de servicio `portal-service@asicorprd.com` (System User) con api_key/api_secret y
  permiso solo a los métodos del portal / lectura de `Lote`, `Customer` necesarios.

## Frontend (Next.js, marca ASICORP, datos reales)

Rutas y archivos:
- `src/app/portal/login/page.tsx` — split-screen (reusa patrón de coop; azul #2C59A4).
- `src/app/portal/layout.tsx` + `src/components/portal/shell.tsx` — shell con nav lateral.
- `src/app/portal/page.tsx` — **Dashboard**: KPIs + lista de lotes (estado con color, monto,
  neto). Server component que consume el BFF con la sesión.
- `src/app/portal/lotes/[name]/page.tsx` — **Detalle**: facturas por cobrar, deducciones,
  comisión/reserva/impuesto, neto; enlace de descarga de comprobante PDF (print format de
  Frappe vía BFF) para "historial + documentos".
- `src/app/portal/configuracion/page.tsx` — editar correo de notificación.
- `src/app/api/portal/login/route.ts`, `src/app/api/portal/logout/route.ts` — sesión.
- `src/lib/frappe.ts` — cliente server-only de Frappe (usa API key de env).
- `src/lib/session.ts` — iron-session (config y helpers).
- `src/middleware.ts` — protección de `/portal/*`.
- Iconos vía SVG (lucide-react). **Sin emoji** en la UI.

Nueva dependencia: `iron-session`.

## Secretos y despliegue

- `.env` (servidor y `.env.local` en dev):
  `FRAPPE_URL=https://erp.asicorprd.com`, `FRAPPE_API_KEY`, `FRAPPE_API_SECRET`,
  `SESSION_SECRET` (>=32 chars). Nunca commiteados.
- Deploy: build en `/root/asicorp-website` -> `pm2 restart asicorp` (según `CLAUDE.md` del
  servidor web). El ERP se toca solo servidor-a-servidor.

## Fases de implementación

- **Fase A — Frappe/`asicorp`:** custom fields en Customer (fixtures), `api.py` (métodos
  whitelisted), rol `Cedente` + cuenta de servicio, `notify_desembolso` + `doc_events`,
  `create_portal_user`. Probar en el ERP con un Customer de prueba.
- **Fase B — Portal Next.js:** `session.ts`, `frappe.ts`, route handlers, `middleware.ts`,
  login, dashboard, detalle, configuración, shell/nav. Probar en dev (:3200) contra el ERP.
- **Fase C — Piloto y deploy:** habilitar un cedente piloto (`create_portal_user`), desplegar,
  prueba end-to-end: login -> ver lotes -> configurar correo -> submit de un Lote de prueba ->
  verificar correo de desembolso.

## Fuera de alcance (v1)

- Notificación por WhatsApp (futuro; `frappe_whatsapp` disponible).
- Autoservicio de registro del cedente (el alta la hace ASICORP vía invitación).
- Edición de lotes o solicitudes desde el portal (solo lectura + config de correo).
- Pagos/cobros en línea.
