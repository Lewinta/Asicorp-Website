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
