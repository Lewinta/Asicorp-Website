# Portal de Cedentes ASICORP — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a los cedentes de ASICORP un portal en `asicorprd.com` para iniciar sesión, ver sus Lotes de factoring (KPIs, lista, detalle, documentos) y configurar un correo que reciba aviso cuando se genere un desembolso.

**Architecture:** El sitio Next.js (PM2 en `asicorprd.com`) actúa de BFF: autentica al cedente contra Frappe, guarda una sesión firmada (iron-session, cookie httpOnly) y lee datos del ERP con una cuenta de servicio, re-filtrando siempre por el cedente de la sesión. El backend Frappe (app `asicorp`) expone métodos whitelisted y un `doc_event` sobre `Lote.on_submit` para la notificación de desembolso.

**Tech Stack:** Frappe/ERPNext 14 (Python), Next.js 16 + React 19 (App Router, TypeScript), Tailwind 4, iron-session, lucide-react.

**Convenciones fijas (usar exactamente estos nombres):**
- Métodos Frappe: `asicorp.api.{create_portal_user, get_portal_profile, get_portal_summary, get_portal_lotes, get_portal_lote_detail, get_notification_email, set_notification_email, notify_desembolso}`
- Custom fields en Customer: `portal_notification_email` (Data), `portal_enabled` (Check)
- Env del portal: `FRAPPE_URL`, `FRAPPE_API_KEY`, `FRAPPE_API_SECRET`, `SESSION_SECRET`
- Cookie de sesión: `asicorp_portal`; forma de la sesión: `{ cedente, customerName, email }`
- Rol Frappe: `Cedente`; usuario de servicio: `portal-service@asicorprd.com`

**Nota de entorno:** El código Frappe vive en el servidor `OVM2` (`~/frappe-bench/apps/asicorp`, que es un repo git). El código Next.js vive en el repo local `asicorp-website` y se despliega al servidor `root@95.111.229.40` (`/root/asicorp-website`, PM2 proceso `asicorp`).

---

## Fase A — Backend Frappe (app `asicorp`)

> Todas las tareas de esta fase se ejecutan por SSH en `OVM2`, editando en `~/frappe-bench/apps/asicorp/asicorp/`. Verificación con `bench --site erp.asicorprd.com execute`/`console`. Commit en el repo de la app.

### Task A1: Custom fields en Customer (correo de notificación)

**Files:**
- Create: `~/frappe-bench/apps/asicorp/asicorp/patches/v0_add_portal_customer_fields.py`
- Modify: `~/frappe-bench/apps/asicorp/asicorp/patches.txt` (append 1 línea)

- [ ] **Step 1: Escribir el patch que crea los custom fields**

`v0_add_portal_customer_fields.py`:
```python
import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields


def execute():
    create_custom_fields({
        "Customer": [
            {
                "fieldname": "portal_section",
                "fieldtype": "Section Break",
                "label": "Portal de Cedente",
                "insert_after": "website",
            },
            {
                "fieldname": "portal_enabled",
                "fieldtype": "Check",
                "label": "Portal habilitado",
                "insert_after": "portal_section",
            },
            {
                "fieldname": "portal_notification_email",
                "fieldtype": "Data",
                "options": "Email",
                "label": "Correo de notificación de desembolso",
                "insert_after": "portal_enabled",
            },
        ]
    }, ignore_validate=True)
    frappe.db.commit()
```

- [ ] **Step 2: Registrar el patch**

Append a `patches.txt` (bajo la sección `[post_model_sync]` si existe, si no al final):
```
asicorp.patches.v0_add_portal_customer_fields
```

- [ ] **Step 3: Ejecutar la migración**

Run: `ssh OVM2 'cd ~/frappe-bench && bench --site erp.asicorprd.com migrate'`
Expected: termina sin error; el patch corre una vez.

- [ ] **Step 4: Verificar que los campos existen**

Run:
```bash
ssh OVM2 'cd ~/frappe-bench && bench --site erp.asicorprd.com execute frappe.client.get_list --kwargs "{\"doctype\":\"Custom Field\",\"filters\":{\"dt\":\"Customer\",\"fieldname\":[\"in\",[\"portal_enabled\",\"portal_notification_email\"]]},\"fields\":[\"fieldname\"]}"'
```
Expected: lista con `portal_enabled` y `portal_notification_email`.

- [ ] **Step 5: Commit**

```bash
ssh OVM2 'cd ~/frappe-bench/apps/asicorp && git add asicorp/patches/v0_add_portal_customer_fields.py asicorp/patches.txt && git commit -m "feat(portal): custom fields de notificación en Customer"'
```

---

### Task A2: Rol `Cedente` y usuario de servicio del portal

**Files:** (sin archivos; se crea vía `bench console`, luego se exporta como fixture si se desea versionar)

- [ ] **Step 1: Crear el rol `Cedente` (Website User, restringido)**

Run:
```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com console <<'PY'
import frappe
if not frappe.db.exists('Role','Cedente'):
    frappe.get_doc({'doctype':'Role','role_name':'Cedente','desk_access':0}).insert()
frappe.db.commit()
print('rol Cedente:', frappe.db.exists('Role','Cedente'))
PY"
```
Expected: `rol Cedente: Cedente`.

- [ ] **Step 2: Crear el usuario de servicio y generar api_key/secret**

Run:
```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com console <<'PY'
import frappe
email='portal-service@asicorprd.com'
if not frappe.db.exists('User',email):
    u=frappe.get_doc({'doctype':'User','email':email,'first_name':'Portal','last_name':'Service','user_type':'System User','send_welcome_email':0}).insert(ignore_permissions=True)
else:
    u=frappe.get_doc('User',email)
u.add_roles('System Manager')  # lectura server-to-server; se puede restringir luego
api_key=u.api_key or frappe.generate_hash(length=15)
u.api_key=api_key
api_secret=frappe.generate_hash(length=15)
u.api_secret=api_secret
u.save(ignore_permissions=True)
frappe.db.commit()
print('API_KEY=',api_key)
print('API_SECRET=',api_secret)
PY"
```
Expected: imprime `API_KEY=...` y `API_SECRET=...`.

- [ ] **Step 3: Guardar las credenciales de forma segura**

Copiar `API_KEY`/`API_SECRET` al gestor de secretos de TZCode. Se usarán como `FRAPPE_API_KEY`/`FRAPPE_API_SECRET` en Fase B (Task B1). No se commitean.

---

### Task A3: Módulo `asicorp/api.py` — perfil, lotes y summary (lectura)

**Files:**
- Create: `~/frappe-bench/apps/asicorp/asicorp/api.py`

- [ ] **Step 1: Escribir `api.py` con los métodos de lectura**

```python
# -*- coding: utf-8 -*-
import frappe
from frappe import _
from frappe.utils import flt, nowdate, add_days

ESTADOS_ACTIVOS = ["Desembolsado", "Vencido"]


def _assert_cedente(cedente):
    """El cedente siempre lo pasa el BFF desde la sesión firmada. Debe existir."""
    if not cedente or not frappe.db.exists("Customer", cedente):
        frappe.throw(_("Cedente inválido"), frappe.PermissionError)
    return cedente


@frappe.whitelist()
def get_portal_profile(email):
    """Resuelve el Customer (cedente) a partir del email de un Website User.
    Usa el enlace estándar Contact -> Dynamic Link -> Customer."""
    email = (email or "").strip().lower()
    contact = frappe.db.sql(
        """
        select dl.link_name as customer
        from `tabContact` c
        join `tabDynamic Link` dl on dl.parent = c.name
        where dl.link_doctype = 'Customer'
          and (c.email_id = %(email)s or exists (
                select 1 from `tabContact Email` ce
                where ce.parent = c.name and ce.email_id = %(email)s))
        limit 1
        """,
        {"email": email},
        as_dict=True,
    )
    if not contact:
        frappe.throw(_("No hay un cedente asociado a este usuario."), frappe.DoesNotExistError)
    customer = contact[0]["customer"]
    return {
        "cedente": customer,
        "customerName": frappe.db.get_value("Customer", customer, "customer_name"),
        "email": email,
    }


@frappe.whitelist()
def get_portal_lotes(cedente, estado=None):
    _assert_cedente(cedente)
    filters = {"cedente": cedente, "docstatus": ["!=", 2]}
    if estado:
        filters["estado"] = estado
    rows = frappe.get_all(
        "Lote",
        filters=filters,
        fields=["name", "fecha", "estado", "monto_total", "neto_desembolsar"],
        order_by="fecha desc, creation desc",
        limit_page_length=0,
    )
    return rows


@frappe.whitelist()
def get_portal_summary(cedente):
    _assert_cedente(cedente)
    lotes = frappe.get_all(
        "Lote",
        filters={"cedente": cedente, "docstatus": 1},
        fields=["name", "estado", "monto_total", "neto_desembolsar"],
        limit_page_length=0,
    )
    total_desembolsado = sum(flt(l["neto_desembolsar"]) for l in lotes if l["estado"] in ("Desembolsado", "Vencido", "Cobrado"))
    lotes_activos = len([l for l in lotes if l["estado"] in ESTADOS_ACTIVOS])
    saldo_por_cobrar = _saldo_por_cobrar(cedente)
    proximos = _proximos_vencimientos(cedente)
    return {
        "total_desembolsado": total_desembolsado,
        "lotes_activos": lotes_activos,
        "saldo_por_cobrar": saldo_por_cobrar,
        "proximos_vencimientos": proximos,
    }


def _saldo_por_cobrar(cedente):
    """Suma 'pendiente' de las facturas por cobrar de los lotes activos del cedente."""
    res = frappe.db.sql(
        """
        select coalesce(sum(f.pendiente),0) as saldo
        from `tabFacturas por Cobrar` f
        join `tabLote` l on l.name = f.parent
        where l.cedente = %(c)s and l.docstatus = 1 and l.estado in ('Desembolsado','Vencido')
        """,
        {"c": cedente},
        as_dict=True,
    )
    return flt(res[0]["saldo"]) if res else 0.0


def _proximos_vencimientos(cedente, dias=15):
    hasta = add_days(nowdate(), dias)
    res = frappe.db.sql(
        """
        select count(*) as n
        from `tabFacturas por Cobrar` f
        join `tabLote` l on l.name = f.parent
        where l.cedente = %(c)s and l.docstatus = 1 and l.estado in ('Desembolsado','Vencido')
          and f.vencimiento between %(hoy)s and %(hasta)s and coalesce(f.pendiente,0) > 0
        """,
        {"c": cedente, "hoy": nowdate(), "hasta": hasta},
        as_dict=True,
    )
    return int(res[0]["n"]) if res else 0
```

- [ ] **Step 2: Recargar y probar `get_portal_lotes` con un cedente real**

Primero, obtener un Customer que tenga lotes:
```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute frappe.client.get_list --kwargs \"{'doctype':'Lote','fields':['cedente'],'limit_page_length':1}\""
```
Luego (sustituir `CUST-XXXX`):
```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.get_portal_lotes --kwargs \"{'cedente':'CUST-XXXX'}\""
```
Expected: lista JSON de lotes con `name/fecha/estado/monto_total/neto_desembolsar`.

- [ ] **Step 3: Probar `get_portal_summary`**

Run:
```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.get_portal_summary --kwargs \"{'cedente':'CUST-XXXX'}\""
```
Expected: dict con `total_desembolsado`, `lotes_activos`, `saldo_por_cobrar`, `proximos_vencimientos`.

- [ ] **Step 4: Commit**

```bash
ssh OVM2 'cd ~/frappe-bench/apps/asicorp && git add asicorp/api.py && git commit -m "feat(portal): api de perfil, lotes y summary"'
```

---

### Task A4: `api.py` — detalle de lote + config de correo

**Files:**
- Modify: `~/frappe-bench/apps/asicorp/asicorp/api.py` (append)

- [ ] **Step 1: Añadir `get_portal_lote_detail`, `get/set_notification_email`**

Append a `api.py`:
```python
@frappe.whitelist()
def get_portal_lote_detail(cedente, lote):
    _assert_cedente(cedente)
    doc = frappe.get_doc("Lote", lote)
    if doc.cedente != cedente:
        frappe.throw(_("No autorizado para ver este lote"), frappe.PermissionError)
    facturas = [
        {
            "fecha": f.fecha, "referencia": f.referencia, "ncf": f.ncf,
            "vencimiento": f.vencimiento, "monto": flt(f.monto),
            "cobrado": flt(f.cobrado), "pendiente": flt(f.pendiente),
        }
        for f in doc.facturas_por_cobrar
    ]
    deducciones = [
        {"deduccion": d.deduccion, "detalle": d.detalle, "monto": flt(d.monto), "tasa": flt(d.tasa)}
        for d in doc.deducciones
    ]
    return {
        "name": doc.name, "fecha": doc.fecha, "estado": doc.estado,
        "monto_total": flt(doc.monto_total),
        "comision_monto": flt(doc.comision_monto),
        "reserva_monto": flt(doc.reserva_monto),
        "impuesto_monto": flt(doc.impuesto_monto),
        "deducciones_totales": flt(doc.deducciones_totales),
        "neto_desembolsar": flt(doc.neto_desembolsar),
        "facturas": facturas,
        "deducciones": deducciones,
    }


@frappe.whitelist()
def get_notification_email(cedente):
    _assert_cedente(cedente)
    return {
        "email": frappe.db.get_value("Customer", cedente, "portal_notification_email") or "",
        "enabled": bool(frappe.db.get_value("Customer", cedente, "portal_enabled")),
    }


@frappe.whitelist()
def set_notification_email(cedente, email):
    _assert_cedente(cedente)
    email = (email or "").strip()
    if email:
        from frappe.utils import validate_email_address
        validate_email_address(email, throw=True)
    frappe.db.set_value("Customer", cedente, "portal_notification_email", email)
    frappe.db.commit()
    return {"ok": True, "email": email}
```

- [ ] **Step 2: Probar el detalle (usar un lote real del cedente)**

```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.get_portal_lote_detail --kwargs \"{'cedente':'CUST-XXXX','lote':'LOT-26-00001'}\""
```
Expected: dict con `facturas` y `deducciones`.

- [ ] **Step 3: Probar guardar y leer el correo**

```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.set_notification_email --kwargs \"{'cedente':'CUST-XXXX','email':'prueba@correo.com'}\"" && \
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.get_notification_email --kwargs \"{'cedente':'CUST-XXXX'}\""
```
Expected: primero `{'ok': True, ...}`, luego `{'email': 'prueba@correo.com', ...}`.

- [ ] **Step 4: Commit**

```bash
ssh OVM2 'cd ~/frappe-bench/apps/asicorp && git add asicorp/api.py && git commit -m "feat(portal): detalle de lote y config de correo"'
```

---

### Task A5: Notificación de desembolso (`doc_event` sobre Lote)

**Files:**
- Modify: `~/frappe-bench/apps/asicorp/asicorp/api.py` (append `notify_desembolso`)
- Modify: `~/frappe-bench/apps/asicorp/asicorp/hooks.py` (`doc_events`)

- [ ] **Step 1: Añadir `notify_desembolso` a `api.py`**

```python
def notify_desembolso(doc, method=None):
    """doc_event on_submit de Lote: avisa al cedente que su desembolso se generó."""
    if doc.doctype != "Lote":
        return
    cedente = doc.cedente
    if not frappe.db.get_value("Customer", cedente, "portal_enabled"):
        return
    email = frappe.db.get_value("Customer", cedente, "portal_notification_email")
    if not email:
        return
    nombre = frappe.db.get_value("Customer", cedente, "customer_name") or cedente
    frappe.sendmail(
        recipients=[email],
        subject=f"Desembolso generado — Lote {doc.name}",
        message=(
            f"<p>Estimado(a) {frappe.utils.escape_html(nombre)},</p>"
            f"<p>Se ha generado el desembolso de su lote <b>{doc.name}</b> "
            f"con fecha {frappe.utils.formatdate(doc.fecha)}.</p>"
            f"<p><b>Neto desembolsado:</b> {frappe.utils.fmt_money(doc.neto_desembolsar, currency='DOP')}</p>"
            f"<p>Puede consultar el detalle en el portal: "
            f"<a href='https://asicorprd.com/portal'>asicorprd.com/portal</a></p>"
            f"<p>ASICORP</p>"
        ),
        now=False,
    )
```

- [ ] **Step 2: Registrar el `doc_event` en `hooks.py`**

Localizar el bloque comentado `# doc_events = {` y reemplazarlo/añadir:
```python
doc_events = {
    "Lote": {
        "on_submit": "asicorp.api.notify_desembolso",
    }
}
```
(Si ya existe un `doc_events`, añadir la clave `"Lote"` sin borrar las demás.)

- [ ] **Step 3: Recargar hooks**

Run: `ssh OVM2 'cd ~/frappe-bench && bench --site erp.asicorprd.com clear-cache && bench --site erp.asicorprd.com migrate'`
Expected: sin error.

- [ ] **Step 4: Probar el envío directo (sin submit) con un cedente que tenga correo y portal habilitado**

```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com console <<'PY'
import frappe
frappe.db.set_value('Customer','CUST-XXXX','portal_enabled',1)
frappe.db.set_value('Customer','CUST-XXXX','portal_notification_email','TU-CORREO-REAL@dominio.com')
frappe.db.commit()
doc=frappe.get_all('Lote',{'cedente':'CUST-XXXX','docstatus':1},limit_page_length=1,pluck='name')
from asicorp.api import notify_desembolso
notify_desembolso(frappe.get_doc('Lote',doc[0]))
frappe.db.commit()
print('enviado para', doc[0])
PY"
```
Expected: imprime `enviado para LOT-...`; el correo llega (si usa cola: `bench --site erp.asicorprd.com execute frappe.email.queue.flush`).

- [ ] **Step 5: Commit**

```bash
ssh OVM2 'cd ~/frappe-bench/apps/asicorp && git add asicorp/api.py asicorp/hooks.py && git commit -m "feat(portal): notificación de desembolso on_submit de Lote"'
```

---

### Task A6: Onboarding — `create_portal_user`

**Files:**
- Modify: `~/frappe-bench/apps/asicorp/asicorp/api.py` (append)

- [ ] **Step 1: Añadir `create_portal_user`**

```python
@frappe.whitelist()
def create_portal_user(customer, email):
    """Crea (o reusa) un Website User ligado al Customer y envía invitación.
    Solo System Manager / Asicorp admin."""
    if "System Manager" not in frappe.get_roles():
        frappe.throw(_("No autorizado"), frappe.PermissionError)
    if not frappe.db.exists("Customer", customer):
        frappe.throw(_("Customer inexistente"))
    email = (email or "").strip().lower()
    from frappe.utils import validate_email_address
    validate_email_address(email, throw=True)

    # 1) Usuario (Website User)
    if frappe.db.exists("User", email):
        user = frappe.get_doc("User", email)
    else:
        cust_name = frappe.db.get_value("Customer", customer, "customer_name") or customer
        parts = cust_name.split(" ", 1)
        user = frappe.get_doc({
            "doctype": "User", "email": email, "first_name": parts[0],
            "last_name": parts[1] if len(parts) > 1 else "",
            "user_type": "Website User", "send_welcome_email": 1,
        }).insert(ignore_permissions=True)
    if "Cedente" not in [r.role for r in user.roles]:
        user.add_roles("Cedente")

    # 2) Contact ligado al Customer (para get_portal_profile)
    contact_name = frappe.db.sql(
        """select c.name from `tabContact` c
           join `tabContact Email` ce on ce.parent=c.name
           where ce.email_id=%s limit 1""", email)
    if contact_name:
        contact = frappe.get_doc("Contact", contact_name[0][0])
    else:
        contact = frappe.get_doc({
            "doctype": "Contact", "first_name": user.first_name,
            "last_name": user.last_name, "user": email,
        })
        contact.append("email_ids", {"email_id": email, "is_primary": 1})
        contact.insert(ignore_permissions=True)
    if not any(l.link_doctype == "Customer" and l.link_name == customer for l in contact.links):
        contact.append("links", {"link_doctype": "Customer", "link_name": customer})
        contact.save(ignore_permissions=True)

    # 3) Habilitar portal en el Customer
    frappe.db.set_value("Customer", customer, "portal_enabled", 1)
    frappe.db.commit()
    return {"ok": True, "user": email, "customer": customer}
```

- [ ] **Step 2: Probar con un Customer de prueba y un correo real**

```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.create_portal_user --kwargs \"{'customer':'CUST-XXXX','email':'cedente.piloto@dominio.com'}\""
```
Expected: `{'ok': True, ...}`; llega el correo de bienvenida de Frappe con enlace para fijar contraseña.

- [ ] **Step 3: Verificar el enlace del perfil**

```bash
ssh OVM2 "cd ~/frappe-bench && bench --site erp.asicorprd.com execute asicorp.api.get_portal_profile --kwargs \"{'email':'cedente.piloto@dominio.com'}\""
```
Expected: `{'cedente':'CUST-XXXX', 'customerName': ..., 'email': ...}`.

- [ ] **Step 4: Commit**

```bash
ssh OVM2 'cd ~/frappe-bench/apps/asicorp && git add asicorp/api.py && git commit -m "feat(portal): onboarding create_portal_user"'
```

---

## Fase B — Portal Next.js (infra + auth)

> Repo local `asicorp-website`. Dev server en :3200. Verificación con el navegador de preview + curl a los route handlers.

### Task B1: Dependencia, env y tipos

**Files:**
- Modify: `asicorp-website/package.json` (dep `iron-session`)
- Create: `asicorp-website/.env.local` (no commitear; ya ignorado por `.gitignore`)
- Create: `asicorp-website/.env.example`
- Create: `asicorp-website/src/lib/portal-types.ts`

- [ ] **Step 1: Instalar iron-session**

Run: `cd asicorp-website && npm install iron-session`
Expected: se añade a `dependencies`.

- [ ] **Step 2: Crear `.env.example`**

```
FRAPPE_URL=https://erp.asicorprd.com
FRAPPE_API_KEY=xxxxxxxxxxxxxxx
FRAPPE_API_SECRET=xxxxxxxxxxxxxxx
SESSION_SECRET=cambiar-por-cadena-larga-de-32-caracteres-o-mas
```

- [ ] **Step 3: Crear `.env.local` con los valores reales** (API_KEY/SECRET de Task A2; `SESSION_SECRET` = `openssl rand -hex 32`). Confirmar que `.env*.local` está en `.gitignore`.

- [ ] **Step 4: Crear `src/lib/portal-types.ts`**

```ts
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
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example src/lib/portal-types.ts && git commit -m "feat(portal): deps, env de ejemplo y tipos"
```

---

### Task B2: Cliente server-only de Frappe

**Files:**
- Create: `asicorp-website/src/lib/frappe.ts`

- [ ] **Step 1: Escribir `frappe.ts`**

```ts
import "server-only";

const BASE = process.env.FRAPPE_URL!;
const KEY = process.env.FRAPPE_API_KEY!;
const SECRET = process.env.FRAPPE_API_SECRET!;

function authHeader() {
  return `token ${KEY}:${SECRET}`;
}

/** Llama un método whitelisted de Frappe con la cuenta de servicio. Devuelve `message`. */
export async function frappeCall<T = unknown>(
  method: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${BASE}/api/method/${method}`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Frappe ${method} ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { message: T };
  return json.message;
}

/** Verifica credenciales de un cedente contra Frappe. true si son válidas. */
export async function frappeVerifyLogin(usr: string, pwd: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/method/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usr, pwd }),
    cache: "no-store",
    redirect: "manual",
  });
  return res.status === 200;
}
```

- [ ] **Step 2: Verificación de humo (con dev server levantado)**

Crear temporalmente `src/app/api/_smoke/route.ts` que llame `frappeCall("asicorp.api.get_portal_profile", {email:"cedente.piloto@dominio.com"})`, hacer `curl localhost:3200/api/_smoke`, confirmar el JSON del perfil, y **borrar** el archivo de humo.
Expected: devuelve `{cedente, customerName, email}`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/frappe.ts && git commit -m "feat(portal): cliente server-only de Frappe"
```

---

### Task B3: Sesión (iron-session)

**Files:**
- Create: `asicorp-website/src/lib/session.ts`

- [ ] **Step 1: Escribir `session.ts`**

```ts
import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { PortalSession } from "@/lib/portal-types";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "asicorp_portal",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  },
};

type SessionData = Partial<PortalSession>;

export async function getSession() {
  const store = await cookies();
  return getIronSession<SessionData>(store, sessionOptions);
}

/** Devuelve la sesión del cedente o null si no está autenticado. */
export async function getCedenteSession(): Promise<PortalSession | null> {
  const s = await getSession();
  if (!s.cedente || !s.email) return null;
  return { cedente: s.cedente, customerName: s.customerName ?? "", email: s.email };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/session.ts && git commit -m "feat(portal): sesión iron-session"
```

---

### Task B4: Route handlers de login y logout

**Files:**
- Create: `asicorp-website/src/app/api/portal/login/route.ts`
- Create: `asicorp-website/src/app/api/portal/logout/route.ts`

- [ ] **Step 1: Escribir `login/route.ts`**

```ts
import { NextResponse } from "next/server";
import { frappeVerifyLogin, frappeCall } from "@/lib/frappe";
import { getSession } from "@/lib/session";
import type { PortalSession } from "@/lib/portal-types";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
  }
  const ok = await frappeVerifyLogin(email, password);
  if (!ok) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }
  let profile: PortalSession;
  try {
    profile = await frappeCall<PortalSession>("asicorp.api.get_portal_profile", { email });
  } catch {
    return NextResponse.json(
      { error: "Tu usuario no está asociado a un cedente. Contacta a ASICORP." },
      { status: 403 },
    );
  }
  const session = await getSession();
  session.cedente = profile.cedente;
  session.customerName = profile.customerName;
  session.email = profile.email;
  await session.save();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Escribir `logout/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verificar login por curl** (dev server levantado; usar el cedente piloto con contraseña ya fijada)

Run:
```bash
curl -i -X POST localhost:3200/api/portal/login -H 'Content-Type: application/json' \
  -d '{"email":"cedente.piloto@dominio.com","password":"LA-CONTRASENA"}'
```
Expected: `200` con `{"ok":true}` y un `Set-Cookie: asicorp_portal=...`. Credenciales malas → `401`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/portal/ && git commit -m "feat(portal): route handlers login/logout"
```

---

### Task B5: Middleware de protección

**Files:**
- Create: `asicorp-website/src/middleware.ts`

- [ ] **Step 1: Escribir `middleware.ts`**

```ts
import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { PortalSession } from "@/lib/portal-types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<Partial<PortalSession>>(req, res, sessionOptions);
  const isAuth = Boolean(session.cedente && session.email);
  const path = req.nextUrl.pathname;
  const isLogin = path === "/portal/login";

  if (!isAuth && path.startsWith("/portal") && !isLogin) {
    return NextResponse.redirect(new URL("/portal/login", req.url));
  }
  if (isAuth && isLogin) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }
  return res;
}

export const config = { matcher: ["/portal/:path*"] };
```

Nota: `session.ts` importa `server-only`; el middleware corre en el edge runtime pero solo importa `sessionOptions` (un objeto plano) — mantener `sessionOptions` libre de dependencias server-only. Si Next se queja por el import de `server-only` transitivo, mover `sessionOptions` a un archivo aparte `src/lib/session-options.ts` sin `server-only` e importarlo en ambos lados.

- [ ] **Step 2: Verificar redirección**

Con el dev server: visitar `localhost:3200/portal` sin cookie → redirige a `/portal/login`. (Se prueba a fondo en Task C.)

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts && git commit -m "feat(portal): middleware de protección de /portal"
```

---

## Fase C — Portal Next.js (UI)

> Reutiliza patrón visual del portal de `coopdinamica-website`, con marca ASICORP (tokens ya presentes en `globals.css`: `--primary #2c59a4`, `--card`, `--muted`, `--danger`, dark mode). Iconos lucide-react. Sin emoji.

### Task C1: Utilidades de formato

**Files:**
- Create: `asicorp-website/src/lib/format.ts`

- [ ] **Step 1: Escribir `format.ts`**

```ts
export function money(n: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency", currency: "DOP", maximumFractionDigits: 2,
  }).format(n || 0);
}

export function fecha(d: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("es-DO", { dateStyle: "medium" }).format(new Date(d));
}

export const ESTADO_STYLE: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Desembolsado: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  Vencido: "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
  Cobrado: "bg-primary/15 text-primary",
  Cancelado: "bg-muted text-muted-foreground line-through",
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/format.ts && git commit -m "feat(portal): utilidades de formato"
```

---

### Task C2: Data layer server-side del portal

**Files:**
- Create: `asicorp-website/src/lib/portal-data.ts`

- [ ] **Step 1: Escribir `portal-data.ts` (funciones server que combinan sesión + frappeCall)**

```ts
import "server-only";
import { getCedenteSession } from "@/lib/session";
import { frappeCall } from "@/lib/frappe";
import type { LoteRow, PortalSummary, LoteDetail } from "@/lib/portal-types";

export async function fetchSummary(): Promise<PortalSummary> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<PortalSummary>("asicorp.api.get_portal_summary", { cedente: s.cedente });
}

export async function fetchLotes(estado?: string): Promise<LoteRow[]> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<LoteRow[]>("asicorp.api.get_portal_lotes", {
    cedente: s.cedente, ...(estado ? { estado } : {}),
  });
}

export async function fetchLoteDetail(lote: string): Promise<LoteDetail> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<LoteDetail>("asicorp.api.get_portal_lote_detail", {
    cedente: s.cedente, lote,
  });
}

export async function fetchNotificationEmail(): Promise<{ email: string; enabled: boolean }> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall("asicorp.api.get_notification_email", { cedente: s.cedente });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/portal-data.ts && git commit -m "feat(portal): data layer server-side"
```

---

### Task C3: Estructura de rutas + shell del portal

**Files:**
- Create: `asicorp-website/src/app/portal/(app)/layout.tsx`
- Create: `asicorp-website/src/components/portal/shell.tsx`
- Create: `asicorp-website/src/components/portal/logout-button.tsx`

Estructura de carpetas (route group `(app)` para que `/portal/login` NO herede el layout protegido):
```
src/app/portal/
  login/page.tsx          <- pública, sin shell (Task C4)
  (app)/
    layout.tsx            <- este task (protegido + shell)
    page.tsx              <- dashboard (C5)
    lotes/page.tsx        <- (C6)
    lotes/[name]/page.tsx <- (C6)
    configuracion/page.tsx<- (C7)
```
El route group `(app)` no cambia la URL: las páginas siguen en `/portal`, `/portal/lotes`, etc. El middleware (`matcher: /portal/:path*`) las cubre igual.

- [ ] **Step 1: `shell.tsx` (server component; recibe la sesión como prop)**

```tsx
import Link from "next/link";
import { LayoutDashboard, FileStack, Settings } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/portal/logout-button";
import type { PortalSession } from "@/lib/portal-types";

const NAV = [
  { href: "/portal", label: "Resumen", icon: LayoutDashboard },
  { href: "/portal/lotes", label: "Mis lotes", icon: FileStack },
  { href: "/portal/configuracion", label: "Configuración", icon: Settings },
];

export function PortalShell({
  session, children,
}: { session: PortalSession; children: React.ReactNode }) {
  const initials = (session.customerName || session.email)
    .split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card p-5 lg:flex">
          <Link href="/" className="mb-8 inline-flex"><Logo /></Link>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((i) => (
              <Link key={i.href} href={i.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <i.icon className="h-[18px] w-[18px]" />{i.label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/80 px-5 py-3 backdrop-blur md:px-8">
            <div>
              <p className="text-xs text-muted-foreground">Portal del Cedente</p>
              <p className="font-display text-lg font-bold text-foreground">
                Hola, {(session.customerName || "Cedente").split(" ")[0]}
              </p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </span>
          </header>
          <main className="px-5 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `logout-button.tsx` (client)**

```tsx
"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.replace("/portal/login");
  }
  return (
    <button onClick={onLogout}
      className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color:var(--danger)]/10 hover:text-[color:var(--danger)]">
      <LogOut className="h-[18px] w-[18px]" /> Cerrar sesión
    </button>
  );
}
```

- [ ] **Step 3: `(app)/layout.tsx` (protege server-side y pasa la sesión al shell)**

```tsx
import { redirect } from "next/navigation";
import { getCedenteSession } from "@/lib/session";
import { PortalShell } from "@/components/portal/shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getCedenteSession();
  if (!session) redirect("/portal/login");
  return <PortalShell session={session}>{children}</PortalShell>;
}
```

- [ ] **Step 4: Commit**

```bash
git add "src/app/portal/(app)/layout.tsx" src/components/portal/ && git commit -m "feat(portal): shell y layout protegido"
```

---

### Task C4: Página de login

**Files:**
- Create: `asicorp-website/src/app/portal/login/page.tsx`
- Create: `asicorp-website/src/components/portal/login-form.tsx`

- [ ] **Step 1: `login-form.tsx` (client)**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/portal/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) { router.replace("/portal"); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setError(j.error || "Error al iniciar sesión"); }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Correo</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="cedente@empresa.com" autoComplete="username"
            className="h-11 w-full bg-transparent text-sm outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password"
            className="h-11 w-full bg-transparent text-sm outline-none" />
        </div>
      </div>
      {error && <p className="rounded-lg bg-[color:var(--danger)]/10 px-3 py-2 text-sm text-[color:var(--danger)]">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Ingresando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: `login/page.tsx` (split-screen, marca ASICORP)**

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/portal/login-form";

export default function PortalLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--brand-blue-bright)_0%,transparent_65%)] opacity-40 blur-2xl" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex">
            <span className="rounded-2xl bg-white/95 px-3 py-2"><Logo /></span>
          </Link>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-white">
              Tu liquidez, <br /> siempre a la vista.
            </h1>
            <p className="mt-4 max-w-sm text-white/80">
              Consulta tus lotes, desembolsos y estados de cuenta en un solo lugar.
            </p>
          </div>
          <p className="text-sm text-white/60">ASICORP · Factoring para el sector salud</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <h2 className="font-display text-2xl font-bold text-foreground">Acceso al Portal del Cedente</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa con el correo que registraste con ASICORP.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar el login end-to-end en el navegador de preview**

Levantar dev (`.claude/launch.json` con name `asicorp`, port 3200), `preview_start`, navegar a `/portal/login`, llenar credenciales del cedente piloto, submit → debe redirigir a `/portal`. Revisar `read_console_messages` sin errores.
Expected: sesión creada, redirección a `/portal`.

- [ ] **Step 4: Commit**

```bash
git add src/app/portal/login/ src/components/portal/login-form.tsx && git commit -m "feat(portal): página de login"
```

---

### Task C5: Dashboard (KPIs + lista de lotes)

**Files:**
- Create: `asicorp-website/src/app/portal/(app)/page.tsx`
- Create: `asicorp-website/src/components/portal/kpi-cards.tsx`
- Create: `asicorp-website/src/components/portal/lotes-table.tsx`

- [ ] **Step 1: `kpi-cards.tsx`**

```tsx
import { Banknote, FileStack, Wallet, CalendarClock } from "lucide-react";
import { money } from "@/lib/format";
import type { PortalSummary } from "@/lib/portal-types";

export function KpiCards({ s }: { s: PortalSummary }) {
  const items = [
    { label: "Total desembolsado", value: money(s.total_desembolsado), icon: Banknote },
    { label: "Lotes activos", value: String(s.lotes_activos), icon: FileStack },
    { label: "Saldo por cobrar", value: money(s.saldo_por_cobrar), icon: Wallet },
    { label: "Próximos vencimientos", value: String(s.proximos_vencimientos), icon: CalendarClock },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{i.label}</p>
            <i.icon className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-foreground">{i.value}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `lotes-table.tsx`**

```tsx
import Link from "next/link";
import { money, fecha, ESTADO_STYLE } from "@/lib/format";
import type { LoteRow } from "@/lib/portal-types";

export function LotesTable({ rows }: { rows: LoteRow[] }) {
  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Aún no tienes lotes registrados.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Lote</th><th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Monto total</th>
            <th className="px-4 py-3 text-right">Neto desembolsado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              <td className="px-4 py-3 font-medium">
                <Link href={`/portal/lotes/${r.name}`} className="text-primary hover:underline">{r.name}</Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{fecha(r.fecha)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_STYLE[r.estado] ?? ""}`}>{r.estado}</span>
              </td>
              <td className="px-4 py-3 text-right">{money(r.monto_total)}</td>
              <td className="px-4 py-3 text-right font-semibold">{money(r.neto_desembolsar)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: `(app)/page.tsx` (dashboard server component)**

```tsx
import { fetchSummary, fetchLotes } from "@/lib/portal-data";
import { KpiCards } from "@/components/portal/kpi-cards";
import { LotesTable } from "@/components/portal/lotes-table";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const [summary, lotes] = await Promise.all([fetchSummary(), fetchLotes()]);
  return (
    <div className="space-y-6">
      <KpiCards s={summary} />
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Lotes recientes</h2>
        <LotesTable rows={lotes.slice(0, 8)} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verificar en preview**

Con sesión iniciada, navegar a `/portal`. KPIs con valores reales, tabla con lotes del cedente. `read_console_messages` sin errores; `read_page` confirma montos.

- [ ] **Step 5: Commit**

```bash
git add "src/app/portal/(app)/page.tsx" src/components/portal/kpi-cards.tsx src/components/portal/lotes-table.tsx && git commit -m "feat(portal): dashboard KPIs y lista de lotes"
```

---

### Task C6: Lista completa de lotes + detalle

**Files:**
- Create: `asicorp-website/src/app/portal/(app)/lotes/page.tsx`
- Create: `asicorp-website/src/app/portal/(app)/lotes/[name]/page.tsx`

- [ ] **Step 1: `lotes/page.tsx`**

```tsx
import { fetchLotes } from "@/lib/portal-data";
import { LotesTable } from "@/components/portal/lotes-table";

export const dynamic = "force-dynamic";

export default async function LotesPage() {
  const lotes = await fetchLotes();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Mis lotes</h1>
      <LotesTable rows={lotes} />
    </div>
  );
}
```

- [ ] **Step 2: `lotes/[name]/page.tsx` (detalle con facturas, deducciones y totales)**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { fetchLoteDetail } from "@/lib/portal-data";
import { money, fecha, ESTADO_STYLE } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LoteDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let d;
  try { d = await fetchLoteDetail(name); } catch { notFound(); }

  const totales = [
    ["Monto total", d.monto_total], ["Comisión", d.comision_monto],
    ["Reserva", d.reserva_monto], ["Impuesto", d.impuesto_monto],
    ["Deducciones", d.deducciones_totales],
  ] as const;

  return (
    <div className="space-y-6">
      <Link href="/portal/lotes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a mis lotes
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{d.name}</h1>
          <p className="text-sm text-muted-foreground">{fecha(d.fecha)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${ESTADO_STYLE[d.estado] ?? ""}`}>{d.estado}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground lg:col-span-1">
          <p className="text-sm opacity-80">Neto desembolsado</p>
          <p className="mt-2 font-display text-3xl font-bold">{money(d.neto_desembolsar)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {totales.map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{money(val as number)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Facturas por cobrar</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">NCF</th><th className="px-4 py-3">Referencia</th>
                <th className="px-4 py-3">Vencimiento</th><th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3 text-right">Cobrado</th><th className="px-4 py-3 text-right">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {d.facturas.map((f, idx) => (
                <tr key={idx} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{f.ncf || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.referencia || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fecha(f.vencimiento)}</td>
                  <td className="px-4 py-3 text-right">{money(f.monto)}</td>
                  <td className="px-4 py-3 text-right">{money(f.cobrado)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(f.pendiente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {d.deducciones.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">Deducciones</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Deducción</th><th className="px-4 py-3">Detalle</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {d.deducciones.map((x, idx) => (
                  <tr key={idx} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium">{x.deduccion}</td>
                    <td className="px-4 py-3 text-muted-foreground">{x.detalle || "—"}</td>
                    <td className="px-4 py-3 text-right">{money(x.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verificar en preview**

Navegar a `/portal/lotes`, clic en un lote → detalle con facturas/deducciones/totales. Probar acceso a un lote de OTRO cedente (URL manual con un `name` ajeno) → `notFound()` (404), confirmando el filtro server-side de `get_portal_lote_detail`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/portal/(app)/lotes/" && git commit -m "feat(portal): lista completa y detalle de lote"
```

---

### Task C7: Configuración (correo de notificación)

**Files:**
- Create: `asicorp-website/src/app/portal/(app)/configuracion/page.tsx`
- Create: `asicorp-website/src/components/portal/notif-email-form.tsx`
- Create: `asicorp-website/src/app/api/portal/notificacion/route.ts`

- [ ] **Step 1: Route handler `notificacion/route.ts` (POST guarda; usa sesión)**

```ts
import { NextResponse } from "next/server";
import { getCedenteSession } from "@/lib/session";
import { frappeCall } from "@/lib/frappe";

export async function POST(req: Request) {
  const s = await getCedenteSession();
  if (!s) return NextResponse.json({ error: "no-session" }, { status: 401 });
  const { email } = (await req.json()) as { email?: string };
  try {
    const r = await frappeCall<{ ok: boolean; email: string }>(
      "asicorp.api.set_notification_email", { cedente: s.cedente, email: email ?? "" },
    );
    return NextResponse.json(r);
  } catch (e) {
    const msg = (e as Error).message.toLowerCase();
    return NextResponse.json(
      { error: msg.includes("email") ? "Correo inválido" : "Error al guardar" },
      { status: 400 },
    );
  }
}
```

- [ ] **Step 2: `notif-email-form.tsx` (client)**

```tsx
"use client";
import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotifEmailForm({ initial }: { initial: string }) {
  const [email, setEmail] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving"); setMsg("");
    const res = await fetch("/api/portal/notificacion", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) { setState("ok"); setMsg("Correo guardado."); }
    else { const j = await res.json().catch(() => ({})); setState("error"); setMsg(j.error || "Error"); }
  }

  return (
    <form onSubmit={save} className="max-w-md space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Correo de notificación</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@empresa.com" className="h-11 w-full bg-transparent text-sm outline-none" />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">Te avisaremos aquí cada vez que se genere un desembolso de tus lotes.</p>
      </div>
      {msg && (
        <p className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${state === "ok" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-[color:var(--danger)]/10 text-[color:var(--danger)]"}`}>
          {state === "ok" && <Check className="h-4 w-4" />}{msg}
        </p>
      )}
      <Button type="submit" disabled={state === "saving"}>{state === "saving" ? "Guardando…" : "Guardar"}</Button>
    </form>
  );
}
```

- [ ] **Step 3: `configuracion/page.tsx`**

```tsx
import { fetchNotificationEmail } from "@/lib/portal-data";
import { NotifEmailForm } from "@/components/portal/notif-email-form";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const { email } = await fetchNotificationEmail();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground">Administra cómo recibes las notificaciones de tus desembolsos.</p>
      </div>
      <NotifEmailForm initial={email} />
    </div>
  );
}
```

- [ ] **Step 4: Verificar en preview**

En `/portal/configuracion`: editar el correo, guardar → "Correo guardado". Confirmar por SSH que `get_notification_email` del cedente devuelve el nuevo valor. Probar correo inválido → mensaje de error.

- [ ] **Step 5: Commit**

```bash
git add "src/app/portal/(app)/configuracion/" src/components/portal/notif-email-form.tsx src/app/api/portal/notificacion/ && git commit -m "feat(portal): configuración de correo de notificación"
```

---

## Fase D — Integración, deploy y piloto

### Task D1: Enlace de acceso al portal desde el sitio público

**Files:**
- Modify: `asicorp-website/src/components/layout/navbar.tsx` (añadir enlace "Portal")

- [ ] **Step 1: Añadir un enlace/botón "Acceso cedentes" → `/portal/login`** en el navbar, siguiendo el patrón de los items existentes (usar `Button` o un `Link` destacado). Leer `navbar.tsx` primero para respetar su estructura.

- [ ] **Step 2: Verificar en preview** que el enlace aparece y navega a `/portal/login`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/navbar.tsx && git commit -m "feat(portal): acceso al portal desde el navbar"
```

---

### Task D2: Build de producción local

- [ ] **Step 1: Build**

Run: `cd asicorp-website && npm run build`
Expected: build exitoso. Corregir errores de tipos/lint que aparezcan y re-commit.

- [ ] **Step 2: Commit (si hubo fixes)**

```bash
git add -A && git commit -m "chore(portal): fixes de build"
```

---

### Task D3: Push y despliegue en el servidor web

- [ ] **Step 1: Push del repo local**

Run: `cd asicorp-website && git push` (a su remoto habitual).

- [ ] **Step 2: En el servidor: pull, env, install, build, restart** (seguir `/root/CLAUDE.md`)

```bash
ssh root@95.111.229.40 'cd /root/asicorp-website && git pull && \
  printf "FRAPPE_URL=https://erp.asicorprd.com\nFRAPPE_API_KEY=...\nFRAPPE_API_SECRET=...\nSESSION_SECRET=...\n" > .env.local && \
  npm ci && npm run build && pm2 restart asicorp'
```
(Colocar los valores reales en `.env.local`; NO commitear ese archivo.)

- [ ] **Step 3: Verificar en producción**

Navegar a `https://asicorprd.com/portal/login` (navegador de preview con `url`), iniciar sesión con el cedente piloto → `/portal` con datos reales. Revisar `pm2 logs asicorp --lines 50` sin errores.

---

### Task D4: Prueba end-to-end del ciclo de desembolso

- [ ] **Step 1: Con el cedente piloto**, en el portal configurar su correo de notificación y verlo guardado.

- [ ] **Step 2: En el ERP**, tomar un Lote en Draft del cedente piloto (o crear uno de prueba) y hacer **Submit**.
Expected: `estado` pasa a `Desembolsado`, se genera el Journal Entry, y llega el correo de notificación (revisar Email Queue / flush si aplica).

- [ ] **Step 3: En el portal**, refrescar `/portal` → el lote aparece como `Desembolsado`, KPIs actualizados, y el detalle muestra facturas/deducciones/neto.

- [ ] **Step 4: Marcar el piloto como validado** y documentar en el spec cualquier ajuste.

---

## Self-review del plan

- **Cobertura del spec:** auth (B3–B5, A2, A6), onboarding correo+invitación (A6), KPIs (A3/C5), lista de lotes (A3/C5/C6), detalle (A4/C6), config de correo por el cedente (A4/C7), notificación de desembolso email (A5), BFF con cuenta de servicio (B2), aislamiento por cedente (A3/A4 `_assert_cedente` + validación de `lote.cedente`), despliegue PM2 (D3).
- **Nota de alcance — "historial + documentos":** el historial se cubre con la lista de lotes (estados) + el detalle. La **descarga de comprobante PDF** (print format de Frappe vía BFF) se deja como mejora incremental post-piloto para no bloquear v1. Si se requiere en v1, añadir un route handler `GET /api/portal/lotes/[name]/pdf` que valide el cedente de la sesión y haga `frappeCall` a la descarga de PDF de Frappe.
- **Consistencia de tipos:** los métodos Frappe y sus retornos coinciden con `portal-types.ts` (`LoteRow`, `PortalSummary`, `LoteDetail`, `FacturaRow`, `DeduccionRow`); nombres de campos alineados con el esquema real (`neto_desembolsar`, `pendiente`, `ncf`, etc.). El nombre de función `frappeCall` y `getCedenteSession` se usan consistentes en `frappe.ts`, `session.ts`, `portal-data.ts` y route handlers.
- **Sin placeholders de implementación** salvo secretos (por diseño) y `CUST-XXXX`/correos, que son datos reales a sustituir en ejecución.
```
