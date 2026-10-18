"use client";

import { useId, useState } from "react";
import { MessageCircle } from "lucide-react";
import { tarifa } from "@/lib/contenido";
import { whatsappUrl } from "@/lib/site";
import { Cta, Rise, SectionHead, Sello } from "@/components/site/primitives";

const MIN = 200_000;
const MAX = 20_000_000;
const PASO = 50_000;

const rd = (n: number) => "RD$ " + new Intl.NumberFormat("es-DO", { maximumFractionDigits: 0 }).format(Math.round(n));

/** "¿Cuánto recibe y cuándo?": estima el anticipo con la tarifa publicada por lote. */
export function Simulador() {
  const [monto, setMonto] = useState(1_500_000);
  const [texto, setTexto] = useState(new Intl.NumberFormat("es-DO").format(1_500_000));
  const idRange = useId();
  const idInput = useId();

  const costoMin = monto * (tarifa.porLote.min / 100);
  const costoMax = monto * (tarifa.porLote.max / 100);
  const anticipoMin = monto - costoMax;
  const anticipoMax = monto - costoMin;
  const progreso = ((monto - MIN) / (MAX - MIN)) * 100;

  function fijar(n: number) {
    const v = Math.min(MAX, Math.max(MIN, n));
    setMonto(v);
    setTexto(new Intl.NumberFormat("es-DO").format(v));
  }

  const mensaje = `Hola ASICORP, facturo aproximadamente ${rd(monto)} al mes a las ARS y quiero agendar una reunión de diagnóstico.`;

  return (
    <section id="simulador" className="scroll-mt-20 py-28 md:py-36">
      <div className="container-page mx-auto max-w-7xl md:px-8">
        <SectionHead
          folio="04 / Simulador"
          title={
            <>
              ¿Cuánto recibe <em className="text-primary">y cuándo?</em>
            </>
          }
          lead="Mueva el control con lo que factura al mes a las ARS. El cálculo usa la tarifa publicada por lote."
        />

        <Rise className="mt-14 grid overflow-hidden rounded-[6px] border border-rule bg-white lg:grid-cols-[1.05fr_0.95fr]">
          {/* Controles */}
          <div className="relative p-7 md:p-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 ledger opacity-50" />
            <div className="relative">
              <label htmlFor={idInput} className="folio text-ink-soft">
                Facturación mensual a las ARS
              </label>
              <div className="mt-4 flex items-baseline gap-3 border-b-2 border-ink pb-2">
                <span className="font-serif text-3xl text-ink-soft">RD$</span>
                <input
                  id={idInput}
                  inputMode="numeric"
                  value={texto}
                  onChange={(e) => {
                    const limpio = e.target.value.replace(/[^\d]/g, "");
                    setTexto(limpio ? new Intl.NumberFormat("es-DO").format(Number(limpio)) : "");
                    if (limpio) setMonto(Math.min(MAX, Math.max(MIN, Number(limpio))));
                  }}
                  onBlur={() => fijar(monto)}
                  className="tabular w-full min-w-0 bg-transparent font-serif text-5xl text-ink outline-none md:text-6xl"
                  aria-describedby={`${idInput}-ayuda`}
                />
              </div>
              <p id={`${idInput}-ayuda`} className="mt-2 text-xs text-ink-soft">
                Entre {rd(MIN)} y {rd(MAX)}.
              </p>

              <label htmlFor={idRange} className="sr-only">
                Ajustar facturación mensual
              </label>
              <input
                id={idRange}
                type="range"
                min={MIN}
                max={MAX}
                step={PASO}
                value={monto}
                onChange={(e) => fijar(Number(e.target.value))}
                className="mt-8 h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--navy-deep)]"
                style={{
                  background: `linear-gradient(to right, var(--navy-deep) ${progreso}%, var(--rule) ${progreso}%)`,
                }}
              />

              <div className="mt-6 flex flex-wrap gap-2">
                {[500_000, 1_500_000, 5_000_000, 10_000_000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => fijar(v)}
                    className="min-h-10 rounded-[4px] border border-ink/15 px-3 font-mono text-xs text-ink transition-colors hover:border-ink hover:bg-paper aria-pressed:border-navy-deep aria-pressed:bg-navy-deep aria-pressed:text-white"
                    aria-pressed={monto === v}
                  >
                    {v >= 1_000_000 ? `RD$${v / 1_000_000}M` : `RD$${v / 1000}K`}
                  </button>
                ))}
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-rule pt-6">
                <div>
                  <dt className="text-sm text-ink-soft">Costo del servicio por lote</dt>
                  <dd className="tabular mt-1 font-mono text-ink">
                    {rd(costoMin)} a {rd(costoMax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Cobros al año</dt>
                  <dd className="mt-1 font-mono text-ink">
                    12 <span className="text-ink-soft">en lugar de 9</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Resultado */}
          <div className="relative flex flex-col justify-between gap-10 bg-navy-deep p-7 text-white md:p-12" aria-live="polite">
            <div>
              <p className="folio text-white/50">Usted recibe en 4 días hábiles</p>
              <p className="tabular mt-4 font-serif text-4xl leading-tight md:text-5xl">{rd(anticipoMin)}</p>
              <p className="tabular font-serif text-2xl text-white/50 md:text-3xl">a {rd(anticipoMax)}</p>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
                Total facturado del mes, menos el costo del servicio ({tarifa.porLote.min.toFixed(2)}% a{" "}
                {tarifa.porLote.max.toFixed(2)}% por lote de hasta {tarifa.porLote.plazoDias} días).
              </p>
            </div>

            <div className="border-t border-white/15 pt-6">
              <p className="text-sm text-white/60">Facturación que deja de esperar en la ARS el primer año</p>
              <p className="tabular mt-1 font-mono text-2xl text-[#4ade80]">+ {rd(monto * 3)}</p>
              <p className="mt-1 text-xs text-white/40">3 cobros adicionales frente al ciclo habitual.</p>
            </div>

            <div>
              <Cta href={whatsappUrl(mensaje)} variant="light" external className="w-full sm:w-auto">
                <MessageCircle className="h-4 w-4" /> Agendar diagnóstico con este monto
              </Cta>
              <p className="mt-4 text-xs leading-relaxed text-white/40">
                Estimación referencial. La tarifa final se define según el volumen de facturación y el nivel de gestión requerido.
              </p>
            </div>

            <div className="absolute right-6 top-6 hidden md:block">
              <Sello tono="verde" rotate={8} className="!text-[#4ade80] ![mix-blend-mode:normal]">
                Anticipado
              </Sello>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
