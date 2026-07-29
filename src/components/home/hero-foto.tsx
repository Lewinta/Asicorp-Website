"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroFoto() {
  return (
    <section className="relative overflow-hidden pt-32 pb-8 md:pt-40 md:pb-10">
      {/* atmósfera */}
      <div className="pointer-events-none absolute inset-0 line-texture opacity-40" />
      <Parallax className="pointer-events-none absolute inset-0" range={["-10%", "10%"]}>
        <div className="pointer-events-none absolute -left-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_62%)] opacity-[0.16] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--brand-navy)_0%,transparent_62%)] opacity-[0.14] blur-3xl" />
      </Parallax>

      <div className="container-page relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Texto */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Especialistas en el sector salud
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl md:text-6xl"
          >
            Transformamos tus cuentas por cobrar en{" "}
            <span className="text-gradient-brand">liquidez inmediata</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.16 }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            No esperes meses para cobrar a las ARS. En Asicorp te adelantamos el
            dinero de tus facturas del sector salud y te entregamos el efectivo hoy,
            con un proceso 100% digital y sin aumentar tu deuda bancaria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="/evaluacion" size="lg" className="group">
              Solicita una evaluación gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="/#como-funciona" variant="outline" size="lg">
              Cómo funciona
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Liquidez en 24–72h
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Sin garantías hipotecarias
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> 100% digital
            </span>
          </motion.div>
        </div>

        {/* Foto — oculta en móvil, visible desde tablet */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_70%_20%,var(--brand-blue),transparent_60%)] opacity-20 blur-2xl" />

          <div className="relative aspect-[2136/1506] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <Parallax className="absolute inset-0 scale-110" range={["-5%", "5%"]}>
              <Image
                src="/asicorp_banner.jpg"
                alt="Estetoscopio, calculadora y la firma de un acuerdo: factoring médico y comercial de Asicorp"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Parallax>
          </div>

          {/* Chip flotante: los dos tipos de factoring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
            className="absolute -bottom-4 -right-3 hidden animate-float-slow rounded-2xl border border-border glass px-4 py-3 shadow-soft md:block"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Stethoscope className="h-4 w-4 text-primary" /> Factoring médico
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calculator className="h-4 w-4 text-accent" /> Factoring comercial
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
