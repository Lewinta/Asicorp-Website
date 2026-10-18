"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarCheck,
  Check,
  FileCheck2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  beneficios,
  ciclo,
  complementarios,
  desafios,
  impacto,
  preguntas,
  proximosPasos,
  tarifa,
} from "@/lib/contenido";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { Cta, Rise, SectionHead, Sello, ease } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const pct = (n: number) =>
  new Intl.NumberFormat("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "%";

/* ------------------------------ El desafío ------------------------------ */

export function Desafio() {
  return (
    <section className="py-28 md:py-36">
      <div className="container-page mx-auto grid max-w-7xl gap-14 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <SectionHead
            folio="01 / El desafío del sector salud"
            title={
              <>
                Usted factura hoy.
                <br />
                <span className="text-ink-soft">La ARS paga en meses.</span>
              </>
            }
            lead="Mientras tanto, la nómina, los proveedores y los gastos no esperan. Así se ve el problema que resolvemos."
          />
          <Rise delay={0.15} className="relative mt-12 hidden aspect-[4/5] max-w-sm overflow-hidden rounded-[6px] lg:block">
            <Image
              src="/brand/expedientes.webp"
              alt="Pilas de expedientes y facturas pendientes de cobro"
              fill
              sizes="24rem"
              className="object-cover grayscale-[35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <Sello rotate={-5}>Pendiente de cobro</Sello>
            </div>
          </Rise>
        </div>

        <ol className="self-center border-t border-ink">
          {desafios.map((d, i) => (
            <motion.li
              key={d.titulo}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-rule py-8 md:grid-cols-[4.5rem_1fr] md:py-10"
            >
              <span className="text-sm text-stamp font-semibold tabular">0{i + 1}</span>
              <div>
                <h3 className="text-2xl text-ink transition-colors group-hover:text-primary md:text-[2rem] font-bold">
                  {d.titulo}
                </h3>
                <p className="mt-2 text-ink-soft">{d.texto}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ El ciclo ------------------------------ */

export function Ciclo({ id = "ciclo", num = "02" }: { id?: string; num?: string }) {
  const [activo, setActivo] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id={id} className="relative scroll-mt-20 bg-white py-28 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rule" />
      <div className="container-page mx-auto grid max-w-7xl gap-14 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            folio={`${num} / Cesión de crédito`}
            title={
              <>
                Un ciclo en <span className="text-gradient-brand">4 pasos</span>, todos los meses.
              </>
            }
            lead="Usted factura; nosotros auditamos, radicamos, anticipamos y cobramos."
          />

          <ol className="mt-12 hidden space-y-1 lg:block" aria-hidden>
            {ciclo.map((p, i) => (
              <li
                key={p.n}
                className={cn(
                  "flex items-center gap-4 py-2 transition-all duration-500",
                  activo === i ? "text-ink" : "text-ink-soft/50",
                )}
              >
                <span
                  className={cn(
                    "h-px transition-all duration-500",
                    activo === i ? "w-14 bg-primary" : "w-6 bg-rule",
                  )}
                />
                <span className="text-xs font-semibold tabular">{p.n}</span>
                <span className="text-sm font-medium">{p.titulo}</span>
              </li>
            ))}
          </ol>
        </div>

        <ol className="space-y-6">
          {ciclo.map((p, i) => (
            <li
              key={p.n}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-i={i}
            >
              <Rise className="relative overflow-hidden rounded-[6px] border border-rule bg-paper p-7 md:p-10">
                <div aria-hidden className="pointer-events-none absolute inset-0 ledger opacity-60" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-7xl leading-none text-primary/15 md:text-8xl font-extrabold tracking-tight">{p.n}</span>
                    <Sello
                      tono={i === 2 ? "verde" : i === 3 ? "azul" : "rojo"}
                      rotate={i % 2 ? 7 : -7}
                      className="mt-2"
                    >
                      {p.sello}
                    </Sello>
                  </div>
                  <h3 className="mt-6 text-3xl leading-tight text-ink md:text-4xl font-bold">{p.titulo}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-primary font-semibold tabular">{p.resumen}</p>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{p.texto}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                    {p.puntos.map((pt) => (
                      <li key={pt} className="flex gap-2.5 border-t border-ink/15 pt-3 text-sm leading-snug text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ Impacto: 9 vs 12 ------------------------------ */

const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function FilaCobros({ etiqueta, espera, total, acento }: { etiqueta: string; espera: number; total: number; acento?: boolean }) {
  return (
    <div className="grid gap-3 md:grid-cols-[11rem_1fr_4rem] md:items-center">
      <p className={cn("text-sm font-medium", acento ? "text-white" : "text-white/60")}>{etiqueta}</p>
      <div className="grid grid-cols-12 gap-1 md:gap-1.5">
        {meses.map((m, i) => {
          const cobra = i >= espera;
          return (
            <motion.div
              key={m}
              initial={{ scaleY: 0.15, opacity: 0.2 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.06 }}
              className={cn(
                "flex h-14 origin-bottom items-end justify-center rounded-[3px] pb-1.5 md:h-20",
                !cobra && "hatch border border-dashed border-white/20",
                cobra && (acento ? "bg-[#4ade80]/90 text-navy-deep" : "bg-white/25 text-white"),
              )}
              title={cobra ? `${m}: cobro` : `${m}: en espera`}
            >
              <span className="text-[0.55rem] uppercase md:text-[0.65rem] font-semibold tabular">{m}</span>
            </motion.div>
          );
        })}
      </div>
      <p className={cn("text-4xl md:text-right font-bold", acento ? "text-[#4ade80]" : "text-white/60")}>{total}</p>
    </div>
  );
}

export function Impacto() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-28 text-white md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,white_31px,white_32px)]" />
      <div className="container-page relative mx-auto max-w-7xl md:px-8">
        <SectionHead
          invert
          folio="03 / Impacto financiero"
          title={
            <>
              12 cobros al año <span className="text-white/50">en lugar de 9.</span>
            </>
          }
          lead="Con el ciclo habitual de las ARS, los primeros meses del año se van esperando. Con ASICORP, cada mes facturado es un mes cobrado."
        />

        <div
          className="mt-16 space-y-6 rounded-[6px] border border-white/10 bg-white/[0.03] p-5 md:p-8"
          role="img"
          aria-label="Comparación de cobros recibidos por año: 9 con el ciclo habitual de las ARS y 12 con ASICORP, 3 cobros adicionales."
        >
          <FilaCobros etiqueta="Ciclo habitual ARS" espera={3} total={9} />
          <FilaCobros etiqueta="Con ASICORP" espera={0} total={12} acento />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-white/70">
            <span className="flex items-center gap-3">
              <span className="hatch inline-block h-4 w-6 rounded-[2px] border border-dashed border-white/30" /> Meses en espera de pago
            </span>
            <span className="uppercase tracking-[0.12em] text-[#4ade80] font-semibold tabular">+3 cobros adicionales al año</span>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[6px] bg-white/10 md:grid-cols-3">
          {impacto.map((m, i) => (
            <Rise key={m.valor} delay={i * 0.1} className="bg-navy-deep p-8 md:p-10">
              <p className="text-6xl text-white md:text-7xl font-extrabold tracking-tight">{m.valor}</p>
              <h3 className="mt-5 text-lg font-medium text-white">{m.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{m.texto}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Beneficios ------------------------------ */

const iconosBeneficio = [TrendingUp, Banknote, CalendarCheck, ShoppingCart, TrendingDown, Building2, ShieldCheck, FileCheck2];

export function Beneficios() {
  return (
    <section className="py-28 md:py-36">
      <div className="container-page mx-auto max-w-7xl md:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead
            folio="05 / Beneficios clave"
            title={
              <>
                Lo que cambia en <span className="text-gradient-brand">su institución</span>.
              </>
            }
          />
          <Rise className="max-w-sm text-ink-soft">
            Un flujo de caja mensual y predecible le permite pagar a tiempo, comprar al contado y
            reinvertir.
          </Rise>
        </div>

        <ul className="mt-14 grid border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((b, i) => {
            const Icon = iconosBeneficio[i];
            return (
              <motion.li
                key={b.titulo}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.07 }}
                className="group relative border-b border-r border-rule bg-white/40 p-7 transition-colors duration-300 hover:bg-white md:p-8"
              >
                <span aria-hidden className="absolute right-6 top-6 text-[0.65rem] text-ink-soft/50 font-semibold tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.6} />
                <h3 className="mt-8 text-2xl leading-tight text-ink font-bold">{b.titulo}</h3>
                <p className="mt-2 text-sm text-ink-soft">{b.texto}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------ Complementarios ------------------------------ */

export function Complementarios({ id, num = "06" }: { id?: string; num?: string }) {
  return (
    <section id={id} className="scroll-mt-20 bg-white py-28 md:py-36">
      <div className="container-page mx-auto grid max-w-7xl gap-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHead
            folio={`${num} / Servicios complementarios`}
            title={
              <>
                Más allá del anticipo: <span className="text-gradient-brand">costos, tarifas y auditoría médica</span>.
              </>
            }
            lead="Estos servicios se contratan de manera independiente al servicio de cesión de crédito."
          />
          <Rise delay={0.1} className="relative mt-10 aspect-[664/408] overflow-hidden rounded-[6px]">
            <Image
              src="/brand/medicos-revision.webp"
              alt="Médicos revisando información en una tableta"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Rise>
        </div>

        <ol className="self-center">
          {complementarios.map((c, i) => (
            <Rise key={c.titulo} delay={i * 0.08}>
              <li className="group grid grid-cols-[auto_1fr] gap-6 border-t border-rule py-9 last:border-b">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-xs text-ink transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white font-semibold tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-2xl leading-snug text-ink md:text-3xl font-bold">{c.titulo}</h3>
                  <p className="mt-3 text-ink-soft">{c.texto}</p>
                </div>
              </li>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ Inversión ------------------------------ */

export function Inversion({ id = "inversion", num = "07" }: { id?: string; num?: string }) {
  return (
    <section id={id} className="scroll-mt-20 py-28 md:py-36">
      <div className="container-page mx-auto max-w-7xl md:px-8">
        <SectionHead
          folio={`${num} / Inversión`}
          align="center"
          title={
            <>
              Una tarifa clara, <span className="text-gradient-brand">publicada</span>.
            </>
          }
          lead="La tarifa final se define según el volumen de facturación y el nivel de gestión requerido."
        />

        <Rise className="relative mx-auto mt-16 max-w-5xl">
          <div className="relative overflow-hidden rounded-[6px] border border-rule bg-white shadow-[0_40px_80px_-50px_rgb(15_35_80/0.4)]">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-rule p-8 md:border-b-0 md:border-r md:p-12">
                <p className="folio text-ink-soft">Mensual</p>
                <p className="tabular mt-4 text-5xl text-ink md:text-6xl font-extrabold tracking-tight">
                  {pct(tarifa.mensual.min)} <span className="text-ink-soft/60">a</span> {pct(tarifa.mensual.max)}
                </p>
                <p className="mt-3 text-ink-soft">de costo mensual del servicio.</p>
              </div>
              <div className="p-8 md:p-12">
                <p className="folio text-ink-soft">Por lote de facturas</p>
                <p className="tabular mt-4 text-5xl text-ink md:text-6xl font-extrabold tracking-tight">
                  {pct(tarifa.porLote.min)} <span className="text-ink-soft/60">a</span> {pct(tarifa.porLote.max)}
                </p>
                <p className="mt-3 text-ink-soft">por lote, con plazo de hasta {tarifa.porLote.plazoDias} días.</p>
              </div>
            </div>

            <div className="grid gap-8 border-t border-rule bg-paper p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
              <div>
                <p className="folio text-primary">Servicio integral que incluye</p>
                <ul className="mt-5 space-y-3">
                  {tarifa.incluye.map((x) => (
                    <li key={x} className="flex items-center gap-3 text-ink">
                      <Check className="h-4 w-4 shrink-0 text-money" strokeWidth={2.5} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l-2 border-money pl-6">
                <p className="text-2xl leading-snug text-ink font-bold">Un costo que puede compensarse.</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  La inversión puede quedar cubierta con los descuentos por compras al contado.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -right-3 -top-6 md:-right-8">
            <Sello rotate={9}>Sin permanencia</Sello>
          </div>
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------ Próximos pasos ------------------------------ */

export function ProximosPasos() {
  return (
    <section className="bg-white py-28 md:py-36">
      <div className="container-page mx-auto max-w-7xl md:px-8">
        <SectionHead
          folio="08 / Próximos pasos"
          title={
            <>
              De la primera reunión a su <span className="text-gradient-brand">primer anticipo</span>.
            </>
          }
        />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease }}
            className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-primary/40 md:block"
          />
          {proximosPasos.map((p, i) => (
            <Rise key={p.titulo} delay={0.2 + i * 0.12}>
              <li className="relative">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-navy-deep text-sm text-white ring-8 ring-white font-semibold tabular">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-2xl text-ink font-bold">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.texto}</p>
              </li>
            </Rise>
          ))}
        </ol>

        <Rise className="mt-16 flex flex-col gap-6 rounded-[6px] border border-money/30 bg-money/[0.06] p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div>
            <p className="text-2xl text-ink md:text-3xl font-bold">Sin compromiso de permanencia</p>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Puede finalizar el acuerdo en cualquier momento, sin penalidad, con preaviso de sesenta (60) días.
            </p>
          </div>
          <Cta href="/evaluacion" className="shrink-0">
            Agendar diagnóstico <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Cta>
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------ Preguntas frecuentes ------------------------------ */

export function Preguntas({ num = "09" }: { num?: string }) {
  return (
    <section className="py-28 md:py-36">
      <div className="container-page mx-auto grid max-w-7xl gap-14 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHead
          folio={`${num} / Preguntas frecuentes`}
          title={
            <>
              Lo que nos preguntan <span className="text-gradient-brand">antes de firmar</span>.
            </>
          }
          className="lg:sticky lg:top-32 lg:self-start"
        />
        <div className="faq border-t border-ink">
          {preguntas.map((p, i) => (
            <details key={p.q} className="group border-b border-rule" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left">
                <h3 className="text-xl text-ink md:text-2xl font-bold">{p.q}</h3>
                <Plus className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-2xl pb-7 leading-relaxed text-ink-soft">{p.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Cierre y contacto ------------------------------ */

const oficina = {
  src: "/brand/oficina-asicorp.webp",
  alt: "Fachada de la oficina de ASICORP en la Av. Independencia 603, Santo Domingo",
  position: "object-[50%_18%]",
};

export function Cierre({ imagen = oficina }: { imagen?: { src: string; alt: string; position?: string } }) {
  const c = siteConfig.contact;
  return (
    <section className="container-page mx-auto max-w-7xl pb-8 md:px-8">
      <div className="relative overflow-hidden rounded-[6px] bg-navy-deep text-white">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative p-8 md:p-14">
            <p className="folio text-white/50">Hablemos</p>
            <h2 className="mt-5 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
              Será un placer acompañar el crecimiento de <span className="text-white/60">su institución</span>.
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Cta
                href={whatsappUrl("Hola ASICORP, quiero agendar una reunión de diagnóstico para mi institución.")}
                variant="light"
                external
              >
                <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
              </Cta>
              <Cta href="/evaluacion" className="border border-white/25 bg-transparent shadow-none hover:bg-white/10">
                Solicitar evaluación <ArrowUpRight className="h-4 w-4" />
              </Cta>
            </div>

            <dl className="mt-12 grid gap-6 border-t border-white/15 pt-8 text-sm sm:grid-cols-3">
              <div>
                <dt className="folio flex items-center gap-2 text-white/50">
                  <Phone className="h-3.5 w-3.5" /> Teléfono
                </dt>
                <dd className="mt-2">
                  <a href={`tel:+1${c.phone.replace(/\D/g, "")}`} className="hover:underline">{c.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="folio flex items-center gap-2 text-white/50">
                  <Mail className="h-3.5 w-3.5" /> Correo
                </dt>
                <dd className="mt-2">
                  <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                </dd>
              </div>
              <div>
                <dt className="folio flex items-center gap-2 text-white/50">
                  <MapPin className="h-3.5 w-3.5" /> Oficina
                </dt>
                <dd className="mt-2 leading-relaxed">{c.address}</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-h-72 lg:min-h-full">
            <Image
              src={imagen.src}
              alt={imagen.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className={cn("object-cover", imagen.position)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/10 to-transparent max-lg:bg-gradient-to-b" />
          </div>
        </div>
      </div>
    </section>
  );
}
