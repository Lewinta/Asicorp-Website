"use client";

import { ClipboardPlus, HeartHandshake, Laptop, ShieldCheck } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const items = [
  {
    icon: ClipboardPlus,
    title: (
      <>
        Especialistas
        <br />
        en la Salud
      </>
    ),
  },
  {
    icon: HeartHandshake,
    title: (
      <>
        Atención Personalizada
        <br />
        y Cercana
      </>
    ),
  },
  {
    icon: Laptop,
    title: (
      <>
        Proceso 100%
        <br />
        Digital
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: (
      <>
        Confidencialidad
        <br />
        y Seguridad
      </>
    ),
  },
];

export function TrustBand() {
  return (
    <section className="relative overflow-hidden">
      {/* el mismo patrón del hero, a todo lo ancho: continúa por los costados del panel */}
      <div className="pointer-events-none absolute inset-0 line-texture opacity-40" />

      <div className="container-page relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl text-white shadow-lift">
        {/* patrón diagonal: queda detrás del azul y se ve a través de él */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--brand-navy) 32%, transparent) 0 1px, transparent 1px 15px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--brand-navy) 32%, transparent) 0 1px, transparent 1px 15px)",
          }}
        />
        {/* azul translúcido encima del patrón */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 gradient-brand opacity-[0.86]"
        />

        <StaggerGroup
          once
          className="relative z-10 grid grid-cols-2 gap-y-10 p-8 md:grid-cols-4 md:gap-y-0 md:p-10"
        >
          {items.map(({ icon: Icon, title }, i) => (
            <StaggerItem
              key={i}
              className={[
                "flex flex-col items-center border-white/15 px-4 text-center md:px-6",
                // divisores verticales entre columnas (no en la primera de cada fila)
                i % 2 !== 0 ? "border-l" : "",
                "md:border-l md:first:border-l-0",
              ].join(" ")}
            >
              <Icon strokeWidth={1.4} className="h-9 w-9 text-white/90" aria-hidden />
              <p className="mt-4 text-sm font-semibold leading-snug text-white/95 md:text-[0.95rem]">
                {title}
              </p>
            </StaggerItem>
          ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
