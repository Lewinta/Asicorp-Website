import { redirect } from "next/navigation";
import { getCedenteSession } from "@/lib/session";
import { fetchNotificationEmail } from "@/lib/portal-data";
import { NotifEmailForm } from "@/components/portal/notif-email-form";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const session = await getCedenteSession();
  if (!session) redirect("/portal/login");

  // Dos correos distintos e independientes:
  //  - session.email      -> correo de ACCESO, definido en Frappe (doctype User). Solo lectura aquí.
  //  - email (Customer)   -> correo de NOTIFICACIÓN (Customer.portal_notification_email).
  const { email, enabled } = await fetchNotificationEmail();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground">Administra cómo recibes las notificaciones de tus desembolsos.</p>
      </div>
      <NotifEmailForm initial={email} enabled={enabled} loginEmail={session.email} />
    </div>
  );
}
