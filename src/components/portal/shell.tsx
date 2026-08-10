import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalHeader } from "@/components/portal/portal-header";
import type { PortalSession } from "@/lib/portal-types";

export function PortalShell({
  session, hasLineaCredito = false, children,
}: { session: PortalSession; hasLineaCredito?: boolean; children: React.ReactNode }) {
  const name = (session.customerName || "Cedente").split(" ")[0];
  // Pasamos solo el booleano (serializable) a los componentes cliente; ellos
  // construyen el nav con buildPortalNav. Pasar el array con `icon` (una función
  // de lucide) cruzaría el límite RSC y rompe la serialización server->client.
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex">
        <PortalSidebar name={name} hasLineaCredito={hasLineaCredito} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader hasLineaCredito={hasLineaCredito} />
          <main className="px-5 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
