"use client";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/portal/mobile-nav";

export function PortalHeader({ name, initials }: { name: string; initials: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Oculta al bajar (pasado un umbral), muestra al subir
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
      className={`sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-card/80 px-5 py-3 backdrop-blur transition-transform duration-300 md:px-8 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Portal del Cedente</p>
          <p className="truncate font-display text-lg font-bold text-foreground">Hola, {name}</p>
        </div>
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {initials}
      </span>
    </header>
  );
}
