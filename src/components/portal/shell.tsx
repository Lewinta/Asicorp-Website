import { PortalSidebar } from "@/components/portal/sidebar";
import { MobileNav } from "@/components/portal/mobile-nav";
import type { PortalSession } from "@/lib/portal-types";

export function PortalShell({
  session, children,
}: { session: PortalSession; children: React.ReactNode }) {
  const initials = (session.customerName || session.email)
    .split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex">
        <PortalSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/80 px-5 py-3 backdrop-blur md:px-8">
            <div className="flex items-center gap-2">
              <MobileNav />
              <div>
                <p className="text-xs text-muted-foreground">Portal del Cedente</p>
                <p className="font-display text-lg font-bold text-foreground">
                  Hola, {(session.customerName || "Cedente").split(" ")[0]}
                </p>
              </div>
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
