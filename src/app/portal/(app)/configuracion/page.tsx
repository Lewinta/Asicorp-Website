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
