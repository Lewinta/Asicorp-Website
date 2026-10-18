"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Sello de goma. Al entrar en pantalla cae desde arriba con un leve giro,
 * como cuando se estampa un documento.
 */
export function Sello({
  children,
  tono = "rojo",
  rotate = -8,
  className,
  delay = 0,
  animate = true,
}: {
  children: ReactNode;
  tono?: "rojo" | "azul" | "verde";
  rotate?: number;
  className?: string;
  delay?: number;
  animate?: boolean;
}) {
  const cls = cn(
    "sello inline-block select-none text-[0.7rem] md:text-xs",
    tono === "azul" && "sello--azul",
    tono === "verde" && "sello--verde",
    className,
  );
  if (!animate) {
    return (
      <span aria-hidden className={cls} style={{ rotate: `${rotate}deg` }}>
        {children}
      </span>
    );
  }
  return (
    <motion.span
      aria-hidden
      className={cls}
      initial={{ opacity: 0, scale: 1.9, rotate: rotate - 10 }}
      whileInView={{ opacity: 0.92, scale: 1, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.7, delay }}
    >
      {children}
    </motion.span>
  );
}

/** Encabezado de sección: folio en monoespaciada + titular serif. */
export function SectionHead({
  folio,
  title,
  lead,
  className,
  invert = false,
  align = "left",
}: {
  folio: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  invert?: boolean;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}
    >
      <p
        className={cn(
          "folio flex items-center gap-3",
          align === "center" && "justify-center",
          invert ? "text-white/60" : "text-primary",
        )}
      >
        <span className={cn("h-px w-8", invert ? "bg-white/40" : "bg-primary/50")} />
        {folio}
      </p>
      <h2
        className={cn(
          "mt-5 text-balance font-serif text-4xl font-normal leading-[1.05] md:text-5xl lg:text-[3.5rem]",
          invert ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty text-lg leading-relaxed",
            align === "center" && "mx-auto",
            invert ? "text-white/70" : "text-ink-soft",
          )}
        >
          {lead}
        </p>
      )}
    </motion.div>
  );
}

/** Encabezado de páginas interiores. */
export function PageHero({
  folio,
  title,
  lead,
  children,
}: {
  folio: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0 ledger opacity-70 [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]" />
      <div className="container-page relative mx-auto max-w-7xl md:px-8">
        <p
          className="entra folio text-primary"
          style={{ "--d": "0s" } as React.CSSProperties}
        >
          {folio}
        </p>
        <h1
          className="entra mt-6 max-w-5xl text-balance font-serif text-5xl font-normal leading-[1.02] text-ink md:text-7xl"
          style={{ "--d": "0.08s" } as React.CSSProperties}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="entra mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft"
            style={{ "--d": "0.18s" } as React.CSSProperties}
          >
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Entrada suave al hacer scroll. */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Botón/enlace con el estilo del sitio público (esquinas de documento). */
export function Cta({
  href,
  children,
  variant = "solid",
  className,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line" | "light";
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-3 rounded-[4px] px-6 text-[0.95rem] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        variant === "solid" &&
          "bg-navy-deep text-white shadow-[0_14px_30px_-16px_var(--navy-deep)] hover:-translate-y-0.5 hover:bg-primary",
        variant === "line" && "border border-ink/20 text-ink hover:border-ink hover:bg-white",
        variant === "light" && "bg-white text-navy-deep hover:-translate-y-0.5 hover:bg-paper",
        className,
      )}
    >
      {children}
    </a>
  );
}
