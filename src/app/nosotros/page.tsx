import type { Metadata } from "next";
import { Eye, HeartHandshake, Lightbulb, Lock, Target, Zap } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SnapSection } from "@/components/motion/snap-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Asicorp es el aliado financiero especializado en el sector salud de República Dominicana. Conoce nuestra misión, visión y valores.",
};

const valores = [
  { icon: Lock, title: "Confianza", desc: "Procesos claros y transparentes en cada operación." },
  { icon: Zap, title: "Agilidad", desc: "Respuestas rápidas: tu liquidez no puede esperar." },
  { icon: HeartHandshake, title: "Cercanía", desc: "Te acompañamos con un trato humano y especializado." },
  { icon: Lightbulb, title: "Innovación", desc: "Tecnología y procesos digitales para hacerte la vida fácil." },
];

const diferenciadores = [
  "Especialistas únicamente en el sector salud y el cobro a las ARS.",
  "Oferta integral: factoring, facturación, contabilidad y gestión tributaria.",
  "Proceso 100% digital, ágil y transparente.",
  "Acompañamiento de largo plazo, no una transacción aislada.",
];

export default function NosotrosPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <SnapSection>
        <section className="relative overflow-hidden pt-32 md:pt-40">
          <div className="pointer-events-none absolute inset-0 line-texture opacity-40" />
          <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_65%)] opacity-15 blur-3xl" />
          <div className="container-page relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Nosotros
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-6xl">
              Financiamos la salud de{" "}
              <span className="text-gradient-brand">República Dominicana</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Asicorp nació para resolver un problema real: los profesionales y empresas
              de salud esperan meses para cobrar a las ARS. Nosotros convertimos esa
              espera en liquidez inmediata.
            </p>
          </div>
        </section>
      </SnapSection>

      {/* Quiénes somos */}
      <SnapSection>
        <section className="container-page mx-auto mt-16 max-w-5xl px-5 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Quiénes somos
              </span>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                Especialistas financieros del sector salud
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Combinamos experiencia financiera con un conocimiento profundo del
                  sector salud dominicano y del proceso de cobro a las aseguradoras.
                </p>
                <p>
                  Más allá de adelantarte el dinero de tus facturas, nos convertimos en el aliado integral
                  que ordena tus finanzas, cumple tus obligaciones y te acompaña a
                  crecer con tranquilidad.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, var(--brand-navy), var(--brand-blue))" }}
                />
                <div className="absolute inset-0 grid-texture opacity-20" />
                <div className="absolute inset-0 grid place-items-center p-8 text-center text-white">
                  <div>
                    <p className="font-display text-5xl font-extrabold">24–72h</p>
                    <p className="mt-2 text-white/80">de tu factura a tu cuenta</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </SnapSection>

      {/* Misión y Visión */}
      <SnapSection>
        <section className="container-page mx-auto mt-20 max-w-5xl px-5 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-foreground">Misión</h3>
                <p className="mt-3 text-muted-foreground">
                  Brindar liquidez y soluciones financieras integrales al sector salud,
                  con agilidad y transparencia, para que sus profesionales y empresas
                  crezcan sanos y ordenados.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                  <Eye className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-foreground">Visión</h3>
                <p className="mt-3 text-muted-foreground">
                  Ser el aliado financiero de referencia del sector salud en República
                  Dominicana, reconocido por su especialización, cercanía e innovación.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </SnapSection>

      {/* Valores */}
      <SnapSection>
        <section className="container-page mx-auto mt-20 max-w-6xl px-5 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Nuestros valores</h2>
          </div>
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-3xl border border-border bg-card p-6 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <v.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </SnapSection>

      {/* Por qué elegirnos */}
      <SnapSection>
        <section className="container-page mx-auto mt-20 max-w-5xl px-5 md:px-8">
          <Reveal>
            <div className="rounded-[2rem] bg-secondary p-8 text-white md:p-12">
              <h2 className="text-3xl font-bold sm:text-4xl">¿Por qué elegir a Asicorp?</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {diferenciadores.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-white/90">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
              </ul>
              <Button href="/evaluacion" variant="accent" size="lg" className="mt-8">
                Solicita tu evaluación gratuita
              </Button>
            </div>
          </Reveal>
        </section>
      </SnapSection>
    </div>
  );
}
