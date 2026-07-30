"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/portal/logout-button";
import { PORTAL_NAV, isNavActive } from "@/components/portal/nav-items";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Cierra el menú al cambiar de página
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const drawer = (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col border-r border-border bg-card p-5 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Logo compact />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {PORTAL_NAV.map((i) => {
            const active = isNavActive(i.href, pathname);
            return (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <i.icon className="h-[18px] w-[18px] shrink-0" />
                {i.label}
              </Link>
            );
          })}
        </nav>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-foreground transition-colors hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
