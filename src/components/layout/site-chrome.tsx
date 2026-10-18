"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/**
 * Muestra el navbar/footer del sitio público, pero los oculta en el portal
 * (/portal/*), que tiene su propio chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal");

  if (isPortal) return <>{children}</>;

  return (
    <div className="site-public">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
