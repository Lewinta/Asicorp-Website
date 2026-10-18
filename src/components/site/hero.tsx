"use client";

import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { cifras, clientesObjetivo } from "@/lib/contenido";
import { Cta, Sello, ease } from "@/components/site/primitives";

// Lote de ejemplo para la animación del hero (cifras ilustrativas).
const partidas = [
  { concepto: "Consultas especializadas", monto: 412500 },
  { concepto: "Imágenes diagnósticas", monto: 286300 },
  { concepto: "Laboratorio clínico", monto: 198700 },
  { concepto: "Procedimientos", monto: 352500 },
];
const total = partidas.reduce((a, p) => a + p.monto, 0);
const anticipo = Math.round(total * (1 - 0.075));
const rd = (n: number) => new Intl.NumberFormat("es-DO").format(n);

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 ledger opacity-70 [mask-image:linear-gradient(to_bottom,#000_40%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[calc(50%-39.5rem)] hidden w-px bg-stamp/25 xl:block" />

      <div className="container-page relative mx-auto grid max-w-7xl items-center gap-14 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <p
            className="entra folio text-primary"
            style={{ "--d": "0s" } as React.CSSProperties}
          >
            Cesión de crédito para el sector salud · Santo Domingo
          </p>

          <h1
            className="entra mt-6 text-balance font-serif text-[2.75rem] font-normal leading-[1.02] text-ink sm:text-6xl lg:text-[5.1rem]"
            style={{ "--d": "0.08s" } as React.CSSProperties}
          >
            Lo que factura a las ARS,{" "}
            <em className="text-primary">en su cuenta</em>{" "}
            en 4&nbsp;días hábiles.
          </h1>

          <p
            className="entra mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft"
            style={{ "--d": "0.18s" } as React.CSSProperties}
          >
            ASICORP audita, radica y le anticipa el total facturado a las ARS cada mes.
            Luego cobramos y conciliamos cada pago. Sin préstamos, garantías ni avales.
          </p>

          <div
            className="entra mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ "--d": "0.26s" } as React.CSSProperties}
          >
            <Cta href="/evaluacion">
              Agendar reunión de diagnóstico
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Cta>
            <Cta href="#ciclo" variant="line">
              Ver cómo funciona
            </Cta>
          </div>

          <ul
            className="entra mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-soft"
            style={{ "--d": "0.5s" } as React.CSSProperties}
            aria-label="Para quién es"
          >
            {clientesObjetivo.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <Expediente />
      </div>

      {/* Cifras clave de la propuesta */}
      <div className="container-page relative mx-auto mt-20 max-w-7xl md:mt-28 md:px-8">
        <dl className="grid grid-cols-2 border-y border-rule lg:grid-cols-4">
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

/** El documento del hero: se audita partida por partida, se radica y sale el anticipo. */
function Expediente() {
  const base = 0.7;
  return (
    <div
      className="entra relative mx-auto w-full max-w-md rotate-[1.2deg] lg:ml-auto"
      style={{ "--d": "0.25s" } as React.CSSProperties}
      role="img"
      aria-label={`Ejemplo: una reclamación a la ARS por RD$${rd(total)} se audita, se radica y se anticipa RD$${rd(anticipo)} en 4 días hábiles.`}
    >
      {/* hoja de atrás */}
      <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 -rotate-2 rounded-[6px] border border-rule bg-paper-deep" />

      <div className="relative rounded-[6px] border border-rule bg-white p-6 shadow-[0_40px_80px_-40px_rgb(15_35_80/0.45)] md:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-dashed border-rule pb-4">
          <div>
            <p className="folio text-ink-soft">Reclamación a ARS</p>
            <p className="mt-1 font-serif text-xl text-ink">Lote del mes</p>
          </div>
          <p className="font-mono text-[0.7rem] leading-relaxed text-ink-soft">
            Ejemplo
            <br />
            ilustrativo
          </p>
        </div>

        <ul className="divide-y divide-rule/70">
          {partidas.map((p, i) => (
            <li key={p.concepto} className="flex items-center gap-3 py-3 text-sm">
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: base + i * 0.28, type: "spring", stiffness: 500, damping: 24 }}
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </motion.span>
              <span className="flex-1 text-ink">{p.concepto}</span>
              <span className="tabular font-mono text-ink-soft">{rd(p.monto)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-baseline justify-between border-t-2 border-ink pt-3">
          <span className="folio text-ink">Total facturado</span>
          <span className="tabular font-mono text-lg font-semibold text-ink">RD$ {rd(total)}</span>
        </div>

        {/* sello RADICADO */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 2.2, rotate: -22 }}
          animate={{ opacity: 0.9, scale: 1, rotate: -12 }}
          transition={{ delay: base + 1.35, type: "spring", stiffness: 380, damping: 18 }}
          className="sello absolute left-[40%] top-[41%] text-sm md:text-base"
        >
          Radicado
        </motion.span>

        {/* comprobante del anticipo */}
        <div
          className="entra mt-6 rounded-[4px] bg-navy-deep p-5 text-white"
          style={{ "--d": "2.6s" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between">
            <span className="folio text-white/60">Anticipo · día hábil 4</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ade80]" />
          </div>
          <p className="tabular mt-2 font-mono text-3xl font-semibold">RD$ {rd(anticipo)}</p>
          <p className="mt-1 text-xs text-white/60">Total facturado, menos el costo del servicio (7.50% por lote).</p>
        </div>
      </div>

      <div className="absolute -left-4 -top-5 hidden md:block">
        <Sello tono="azul" rotate={-6} delay={base + 0.2}>
          Auditado
        </Sello>
      </div>
    </div>
  );
}
