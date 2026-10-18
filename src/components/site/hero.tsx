"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { cifras } from "@/lib/contenido";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";
import { ease } from "@/components/site/primitives";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/**
 * Primera sección de la versión anterior (foto del banner), con el texto alineado
 * a la propuesta de servicios. Las entradas son CSS para que el titular se vea
 * aunque el JS tarde en cargar.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-8 font-sans md:pt-40 md:pb-10">
      {/* atmósfera */}
      <div className="pointer-events-none absolute inset-0 line-texture opacity-40" />
      <Parallax className="pointer-events-none absolute inset-0" range={["-10%", "10%"]}>
        <div className="pointer-events-none absolute -left-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_62%)] opacity-[0.16] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--brand-navy)_0%,transparent_62%)] opacity-[0.14] blur-3xl" />
      </Parallax>

      <div className="container-page relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Texto */}
        <div>
          <span
            className="entra inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            style={d(0)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Especialistas en el sector salud
          </span>

          <h1
            className="entra mt-6 text-balance font-sans text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl md:text-6xl"
            style={d(0.08)}
          >
            Transformamos sus cuentas por cobrar a las ARS en{" "}
            <span className="text-gradient-brand">liquidez inmediata</span>
          </h1>

          <p
            className="entra mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            style={d(0.16)}
          >
            No espere meses para cobrar a las ARS. ASICORP audita y radica su facturación,
            le anticipa el total facturado en 4 días hábiles y se encarga del cobro. Sin
            préstamos, garantías ni avales.
          </p>

          <div className="entra mt-9 flex flex-col gap-3 sm:flex-row" style={d(0.24)}>
            <Button href="/evaluacion" size="lg" className="group">
              Agendar reunión de diagnóstico
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="/#ciclo" variant="outline" size="lg">
              Cómo funciona
            </Button>
          </div>

          <div
            className="entra mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            style={d(0.4)}
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Anticipo en 4 días hábiles
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Sin garantías ni avales
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> No es un préstamo
            </span>
          </div>
        </div>

        {/* Foto: oculta en móvil, visible desde tablet */}
        <div className="entra relative hidden md:block" style={d(0.2)}>
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_70%_20%,var(--brand-blue),transparent_60%)] opacity-20 blur-2xl" />

          <div className="relative aspect-[2136/1506] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <Parallax className="absolute inset-0 scale-110" range={["-5%", "5%"]}>
              <Image
                src="/asicorp_banner.jpg"
                alt="Estetoscopio, calculadora y la firma de un acuerdo: cesión de crédito de ASICORP para el sector salud"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Parallax>
          </div>

          {/* Chip flotante */}
          <div className="absolute -bottom-4 -right-3 hidden animate-float-slow rounded-2xl border border-border glass px-4 py-3 shadow-soft md:block">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Stethoscope className="h-4 w-4 text-primary" /> Cesión de crédito
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileSearch className="h-4 w-4 text-accent" /> Auditoría forense
            </p>
          </div>
        </div>
      </div>

      {/* Cifras clave de la propuesta */}
      <div className="container-page relative mx-auto mt-20 max-w-7xl md:mt-24 md:px-8">
        <dl className="grid grid-cols-2 border-y border-rule font-[family-name:var(--font-geist)] lg:grid-cols-4">
          {cifras.map((c, i) => (
            <motion.div
              key={c.etiqueta}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="flex flex-col gap-2 border-rule px-2 py-8 odd:border-r sm:px-6 lg:border-r lg:last:border-r-0"
            >
              <dt className="order-2 text-sm leading-snug text-ink-soft">{c.etiqueta}</dt>
              <dd className="order-1 font-serif text-5xl text-ink md:text-6xl">{c.valor}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
