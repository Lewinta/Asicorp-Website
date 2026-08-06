import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { frappeCall } from "@/lib/frappe";
import type { PortalSession } from "@/lib/portal-types";

export const dynamic = "force-dynamic";

/**
 * Sana una sesión cuyo cedente quedó obsoleto (p. ej. tras un rename/merge del
 * Customer en el ERP). Re-resuelve el cedente a partir del correo de la sesión
 * y reescribe la cookie. Si el correo ya no corresponde a ningún cedente,
 * destruye la sesión y manda al login.
 *
 * Es un Route Handler (no un Server Component) porque solo aquí se puede
 * escribir/borrar la cookie de sesión durante una request.
 */
export async function GET() {
  const s = await getSession();
  let healed = false;

  if (s.email) {
    try {
      const fresh = await frappeCall<PortalSession>("asicorp.api.get_portal_profile", {
        email: s.email,
      });
      s.cedente = fresh.cedente;
      s.customerName = fresh.customerName;
      s.email = fresh.email;
      await s.save();
      healed = true;
    } catch {
      healed = false;
    }
  }

  // redirect() lanza NEXT_REDIRECT, por eso va fuera del try/catch.
  if (healed) redirect("/portal");

  s.destroy();
  redirect("/portal/login");
}
