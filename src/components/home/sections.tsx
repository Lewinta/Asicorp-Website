"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  Calculator,
  ClipboardList,
  FileCheck2,
  FileText,
  FlaskConical,
  Handshake,
  Headset,
  HeartPulse,
  Landmark,
  LineChart,
  Microscope,
  MonitorSmartphone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { stats } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/* ----------------- Estadísticas ----------------- */

export function StatsBand() {
  return (
    <section className="container-page mx-auto max-w-7xl px-5 md:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-4 md:p-10">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-3xl font-extrabold text-primary md:text-5xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------- Beneficios ----------------- */

const beneficios = [
  { icon: Banknote, title: "Liquidez en 24–72 horas", desc: "Recibe el efectivo de tus facturas sin esperar el ciclo de pago de la ARS." },
  { icon: ShieldCheck, title: "Sin garantías hipotecarias", desc: "No pedimos avales ni hipotecas: tu cuenta por cobrar es el respaldo." },
  { icon: Landmark, title: "Sin aumentar tu deuda bancaria", desc: "El factoring no es un préstamo; no afecta tu capacidad de crédito." },
  { icon: Activity, title: "Sin afectar tu flujo de caja", desc: "Conviertes ventas a crédito en capital de trabajo disponible hoy." },
  { icon: HeartPulse, title: "Especialistas en salud", desc: "Conocemos a fondo el cobro a las ARS y el sector salud dominicano." },
  { icon: MonitorSmartphone, title: "Proceso 100% digital", desc: "Solicita, firma y da seguimiento en línea, sin filas ni papeleo." },
];

export function Benefits() {
  return (
    <section className="container-page mx-auto max-w-7xl px-5 py-24 md:px-8">
      <SectionHeading
        eyebrow="Beneficios"
        title={<>Cobra hoy lo que la ARS te paga <span className="text-gradient-brand">en meses</span></>}
        description="Diseñado para que los profesionales y empresas de salud tengan el oxígeno financiero que necesitan, cuando lo necesitan."
      />
      <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {beneficios.map((b) => (
          <StaggerItem key={b.title}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

/* ----------------- A quién ayudamos ----------------- */

const sectores = [
  { icon: Stethoscope, title: "Médicos independientes" },
  { icon: Building2, title: "Clínicas" },
  { icon: FlaskConical, title: "Laboratorios clínicos" },
  { icon: ScanLine, title: "Centros de imágenes" },
  { icon: Microscope, title: "Centros diagnósticos" },
  { icon: HeartPulse, title: "Hospitales" },
  { icon: Briefcase, title: "Empresas de salud" },
];

export function Sectores() {
  return (
    <section id="sectores" className="relative overflow-hidden scroll-mt-24 bg-card py-24">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-40" />
      <div className="container-page relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="¿A quién ayudamos?"
          title="Hecho para todo el ecosistema de salud"
          description="Si facturas servicios de salud a las ARS, Asicorp es para ti."
        />
        <StaggerGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sectores.map((s) => (
            <StaggerItem key={s.title}>
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-background p-6 text-center transition-colors hover:border-primary/40">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                  <s.icon className="h-7 w-7" />
                </span>
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ----------------- Cómo funciona ----------------- */

const pasos = [
  { icon: FileText, n: "01", title: "Facturas a la ARS", desc: "Prestas tu servicio de salud y emites la factura a la aseguradora." },
  { icon: Handshake, n: "02", title: "Asicorp adelanta tu dinero", desc: "Evaluamos tu cuenta por cobrar y te adelantamos el dinero de forma transparente." },
  { icon: Banknote, n: "03", title: "Recibes tu dinero", desc: "Te entregamos el efectivo de inmediato, en 24 a 72 horas." },
  { icon: Headset, n: "04", title: "Gestionamos el cobro", desc: "Nosotros nos encargamos de cobrarle a la ARS por ti." },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="container-page mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <SectionHeading
        eyebrow="Cómo funciona"
        title={<>Cuatro pasos para tu <span className="text-gradient-brand">liquidez</span></>}
        description="Un proceso simple, claro y sin sorpresas."
      />
      <div className="relative mt-14">
        <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-border lg:block" />
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((p) => (
            <StaggerItem key={p.n}>
              <div className="relative h-full rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <p.icon className="h-7 w-7" />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-border">{p.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ----------------- Por qué Asicorp (integral) ----------------- */

const integrales = [
  { icon: Banknote, title: "Factoring de salud" },
  { icon: FileCheck2, title: "Facturación electrónica" },
  { icon: Calculator, title: "Contabilidad" },
  { icon: Landmark, title: "Gestión tributaria" },
  { icon: LineChart, title: "Asesoría financiera" },
  { icon: Wallet, title: "Gestión de cobros" },
  { icon: ClipboardList, title: "Gestión administrativa" },
  { icon: Handshake, title: "Acompañamiento empresarial" },
];

export function PorQueAsicorp() {
  return (
    <section className="container-page mx-auto max-w-7xl px-5 py-8 md:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-secondary px-7 py-14 text-white md:px-12 md:py-16">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-15" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--brand-blue-bright)_0%,transparent_65%)] opacity-40 blur-2xl" />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              ¿Por qué Asicorp?
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              No solo adelantamos tu dinero. Somos tu aliado financiero integral.
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Más allá del factoring, ponemos a tu disposición todo lo que tu
              práctica o empresa de salud necesita para crecer ordenada y sin
              dolores de cabeza.
            </p>
            <Button href="/servicios" variant="accent" size="lg" className="mt-7">
              Ver todos los servicios
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {integrales.map((s) => (
              <div
                key={s.title}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-3.5 backdrop-blur transition-colors hover:bg-white/15"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- CTA ----------------- */

export function CTASection() {
  return (
    <section className="container-page mx-auto max-w-7xl px-5 pt-16 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-7 py-16 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 dot-texture opacity-50" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_65%)] opacity-15 blur-2xl" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Convierte tus cuentas por cobrar en{" "}
              <span className="text-gradient-brand">capital de trabajo</span>
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Solicita tu evaluación gratuita y sin compromiso. Te decimos cuánto
              puedes recibir y en cuánto tiempo.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/evaluacion" size="lg" className="group">
                Solicita una evaluación gratuita
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link
                href="/servicios"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Conocer los servicios
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
