import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalHeader } from "@/components/portal/portal-header";
import type { PortalSession } from "@/lib/portal-types";

export function PortalShell({
  session, children,
}: { session: PortalSession; children: React.ReactNode }) {
  const initials = (session.customerName || session.email)
    .split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const name = (session.customerName || "Cedente").split(" ")[0];
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex">
        <PortalSidebar name={name} initials={initials} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader />
          <main className="px-5 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
