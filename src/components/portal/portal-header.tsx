"use client";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/portal/mobile-nav";

// Barra superior solo en móvil: da acceso al menú (hamburguesa). En desktop no
// hay barra; el saludo y la navegación viven en el sidebar.
export function PortalHeader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY && y > 72) setHidden(true);
        else if (y < lastY) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/80 px-4 py-2.5 backdrop-blur transition-transform duration-300 lg:hidden ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <MobileNav />
      <span className="font-display text-base font-extrabold tracking-tight text-primary">
        ASICORP
      </span>
    </header>
  );
}
