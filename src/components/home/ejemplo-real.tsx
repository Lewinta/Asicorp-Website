"use client";

import { motion } from "motion/react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { formatRD } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function EjemploReal() {
  return (
    <section className="container-page mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        {/* Texto */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Un ejemplo real
          </span>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Así se ve el adelanto de tu dinero
          </h2>
          <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Tienes una factura pendiente con la ARS y no quieres esperar meses.
            Nosotros te adelantamos hasta el 90% de su valor hoy y nos encargamos del
            cobro por ti.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> No es un préstamo: no
              aumenta tu deuda bancaria.
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" /> Liquidez en 24–72 horas,
              100% digital.
            </li>
          </ul>
        </div>

        {/* Tarjeta de montos */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_70%_20%,var(--brand-blue),transparent_60%)] opacity-20 blur-2xl" />
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-lift md:p-7">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                Tu factura a la ARS
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Pendiente 90 días
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
              {formatRD(500000)}
            </p>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Asicorp adelanta <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-foreground/80">Recibes hoy</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5" /> Aprobado en 48h
                </span>
              </div>
              <p className="mt-1 font-display text-3xl font-extrabold">{formatRD(450000)}</p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-success">
              <BadgeCheck className="h-4 w-4" /> Nosotros gestionamos el cobro a la ARS por ti.
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease }}
            className="absolute -right-3 -top-3 hidden animate-float-slow rounded-2xl border border-border glass px-4 py-2 text-sm font-semibold text-foreground shadow-soft md:block"
          >
            +90% de adelanto
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
