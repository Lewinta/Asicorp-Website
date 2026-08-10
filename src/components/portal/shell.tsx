import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalHeader } from "@/components/portal/portal-header";
import { buildPortalNav } from "@/components/portal/nav-items";
import type { PortalSession } from "@/lib/portal-types";

export function PortalShell({
  session, hasLineaCredito = false, children,
}: { session: PortalSession; hasLineaCredito?: boolean; children: React.ReactNode }) {
  const name = (session.customerName || "Cedente").split(" ")[0];
  const nav = buildPortalNav({ lineaCredito: hasLineaCredito });
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex">
        <PortalSidebar name={name} nav={nav} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader nav={nav} />
          <main className="px-5 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
