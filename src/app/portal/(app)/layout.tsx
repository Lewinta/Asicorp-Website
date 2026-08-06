import { redirect } from "next/navigation";
import { getCedenteSession } from "@/lib/session";
import { frappeCall } from "@/lib/frappe";
import type { PortalSession } from "@/lib/portal-types";
import { PortalShell } from "@/components/portal/shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getCedenteSession();
  if (!session) redirect("/portal/login");

  // Re-resolvemos el cedente actual a partir del correo (estable) en cada carga.
  // Si un rename/merge del Customer en el ERP cambió el nombre del cedente, la
  // cookie quedaría apuntando a un cedente inexistente y las consultas darían 403
  // -> 500. Detectamos el desfase y sanamos la sesión en /portal/session-refresh.
  const fresh = await frappeCall<PortalSession>("asicorp.api.get_portal_profile", {
    email: session.email,
  });
  if (fresh.cedente !== session.cedente) redirect("/portal/session-refresh");

  return <PortalShell session={session}>{children}</PortalShell>;
}
