import { LayoutDashboard, FileStack, LineChart, Settings, type LucideIcon } from "lucide-react";

export const PORTAL_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/portal", label: "Resumen", icon: LayoutDashboard },
  { href: "/portal/lotes", label: "Mis lotes", icon: FileStack },
  { href: "/portal/analitica", label: "Analítica", icon: LineChart },
  { href: "/portal/configuracion", label: "Configuración", icon: Settings },
];

export function isNavActive(href: string, pathname: string): boolean {
  return href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
}
