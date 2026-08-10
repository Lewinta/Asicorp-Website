import { LayoutDashboard, FileStack, CreditCard, LineChart, Settings, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Items base del portal (sin la línea de crédito).
export const PORTAL_NAV: NavItem[] = [
  { href: "/portal", label: "Resumen", icon: LayoutDashboard },
  { href: "/portal/lotes", label: "Mis lotes", icon: FileStack },
  { href: "/portal/analitica", label: "Analítica", icon: LineChart },
  { href: "/portal/configuracion", label: "Configuración", icon: Settings },
];

// Construye el nav según los flags del cedente. El item "Líneas de crédito"
// (ruta /portal/lineas) solo aparece si el cedente tiene una línea aprobada
// (flags.lineaCredito), ubicado entre "Mis lotes" y "Analítica".
export function buildPortalNav(flags: { lineaCredito?: boolean } = {}): NavItem[] {
  const items: NavItem[] = [
    { href: "/portal", label: "Resumen", icon: LayoutDashboard },
    { href: "/portal/lotes", label: "Mis lotes", icon: FileStack },
  ];
  if (flags.lineaCredito) {
    items.push({ href: "/portal/lineas", label: "Líneas de crédito", icon: CreditCard });
  }
  items.push({ href: "/portal/analitica", label: "Analítica", icon: LineChart });
  items.push({ href: "/portal/configuracion", label: "Configuración", icon: Settings });
  return items;
}

export function isNavActive(href: string, pathname: string): boolean {
  return href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
}
