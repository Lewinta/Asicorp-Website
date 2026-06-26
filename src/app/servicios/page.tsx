import type { Metadata } from "next";
import {
  Banknote,
  Calculator,
  ClipboardList,
  FileCheck2,
  Handshake,
  Landmark,
  LineChart,
  Wallet,
} from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Factoring de salud, facturación electrónica, contabilidad, gestión tributaria, asesoría financiera y más. El aliado financiero integral del sector salud.",
};

const factoringPuntos = [
  "Adquirimos tus facturas pendientes a las ARS.",
  "Te adelantamos hasta el 90% del valor en 24–72 horas.",
  "No es un préstamo: no aumenta tu deuda bancaria.",
  "Nosotros gestionamos el cobro a la aseguradora.",
];

const servicios = [
  {
    id: "facturacion",
    icon: FileCheck2,
    title: "Facturación electrónica",
    desc: "Emite tus comprobantes fiscales electrónicos (e-CF) cumpliendo con la DGII, sin complicaciones técnicas y con respaldo total.",
  },
  {
    id: "contabilidad",
    icon: Calculator,
    title: "Contabilidad",
    desc: "Mantén tu contabilidad al día, ordenada y lista para la toma de decisiones, con un equipo que entiende el sector salud.",
  },
  {
    id: "tributaria",
    icon: Landmark,
    title: "Gestión tributaria",
    desc: "Cumple con tus obligaciones fiscales a tiempo: declaraciones, impuestos y normativa siempre bajo control.",
  },
  {
    id: "asesoria",
    icon: LineChart,
    title: "Asesoría financiera",
    desc: "Te acompañamos a planificar tu flujo de caja, financiar tu crecimiento y mejorar la salud financiera de tu práctica o empresa.",
  },
  {
    id: "cobros",
    icon: Wallet,
    title: "Gestión de cobros",
    desc: "Profesionalizamos el cobro de tus cuentas por cobrar para que tú te concentres en tus pacientes.",
  },
  {
    id: "administrativa",
    icon: ClipboardList,
    title: "Gestión administrativa",
    desc: "Apoyo en los procesos administrativos del día a día para que tu operación funcione sin fricciones.",
  },
  {
    id: "acompanamiento",
    icon: Handshake,
    title: "Acompañamiento empresarial",
    desc: "Un aliado de largo plazo que crece contigo y te respalda en cada etapa de tu negocio de salud.",
  },
];

export default function ServiciosPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 dot-texture opacity-40" />
        <div className="container-page relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Servicios
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            Tu aliado financiero <span className="text-gradient-brand">integral</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            Empezamos con la liquidez y nos quedamos para ayudarte a ordenar y hacer
            crecer toda tu operación de salud.
          </p>
        </div>
      </section>

      {/* Factoring destacado */}
      <section id="factoring" className="container-page mx-auto mt-16 max-w-6xl scroll-mt-24 px-5 md:px-8">
        <Reveal>
          <div className="grid items-center gap-10 rounded-[2rem] border border-border bg-card p-8 md:p-12 lg:grid-cols-2">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Banknote className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-3xl font-bold text-foreground sm:text-4xl">
                Factoring de salud
              </h2>
              <p className="mt-3 text-muted-foreground">
                Nuestro servicio insignia: convertimos tus cuentas por cobrar a las
                ARS en efectivo disponible hoy, para que no tengas que esperar el
                ciclo de pago de las aseguradoras.
              </p>
              <ul className="mt-6 space-y-3">
                {factoringPuntos.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <Button href="/evaluacion" size="lg" className="mt-7">
                Solicita tu evaluación
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-[radial-gradient(circle_at_60%_30%,var(--brand-blue),transparent_60%)] opacity-15 blur-2xl" />
              <div className="relative rounded-2xl border border-border bg-background p-6">
                <p className="text-sm text-muted-foreground">Adelanto típico</p>
                <p className="mt-1 font-display text-5xl font-extrabold text-primary">90%</p>
                <p className="mt-1 text-sm text-muted-foreground">del valor de tu factura</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-muted p-3">
                    <p className="font-display text-2xl font-bold text-foreground">24–72h</p>
                    <p className="text-xs text-muted-foreground">Para tu efectivo</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <p className="font-display text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Garantías</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Servicios complementarios */}
      <section className="container-page mx-auto mt-20 max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Mucho más que factoring
          </h2>
          <p className="mt-3 text-muted-foreground">
            Todo lo que tu práctica o empresa de salud necesita, en un solo lugar.
          </p>
        </div>
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((s) => (
            <StaggerItem key={s.id}>
              <div
                id={s.id}
                className="h-full scroll-mt-24 rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* CTA */}
      <section className="container-page mx-auto mt-20 max-w-4xl px-5 text-center md:px-8">
        <div className="rounded-[2rem] bg-secondary p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            ¿Listo para tener tu liquidez y tu operación bajo control?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Solicita una evaluación gratuita y descubre todo lo que Asicorp puede
            hacer por ti.
          </p>
          <Button href="/evaluacion" variant="accent" size="lg" className="mt-6">
            Solicita tu evaluación gratuita
          </Button>
        </div>
      </section>
    </div>
  );
}
