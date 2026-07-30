"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileStack, LineChart, Settings, PanelLeftClose, PanelLeft,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/portal/logout-button";

const NAV = [
  { href: "/portal", label: "Resumen", icon: LayoutDashboard },
  { href: "/portal/lotes", label: "Mis lotes", icon: FileStack },
  { href: "/portal/analitica", label: "Analítica", icon: LineChart },
  { href: "/portal/configuracion", label: "Configuración", icon: Settings },
];

const STORAGE_KEY = "asicorp_sidebar_collapsed";

export function PortalSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card p-4 lg:flex ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <Link href="/" className="inline-flex">
            <Logo />
          </Link>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? <PanelLeft className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((i) => {
          const active = i.href === "/portal" ? pathname === "/portal" : pathname.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              title={collapsed ? i.label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <i.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && i.label}
            </Link>
          );
        })}
      </nav>

      <LogoutButton />
    </aside>
  );
}
