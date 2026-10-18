import type { Metadata } from "next";
import { Cta, Sello } from "@/components/site/primitives";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden px-5 pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 ledger opacity-70" />
      <div className="relative max-w-xl text-center">
        <div className="relative mx-auto w-full max-w-sm rotate-[-1.5deg] rounded-[6px] border border-rule bg-white p-8 text-left shadow-[0_40px_80px_-40px_rgb(15_35_80/0.45)]">
          <p className="folio text-ink-soft">Reclamación n.º 404</p>
          <p className="mt-2 text-2xl text-ink font-bold">Página no encontrada</p>
          <div className="mt-6 space-y-2" aria-hidden>
            <div className="h-2 w-full rounded bg-paper-deep" />
            <div className="h-2 w-4/5 rounded bg-paper-deep" />
            <div className="h-2 w-3/5 rounded bg-paper-deep" />
          </div>
          <div className="absolute right-5 top-12">
            <Sello rotate={-14} animate={false} className="text-sm">Devuelta</Sello>
          </div>
        </div>
        <h1 className="mt-12 text-4xl text-ink md:text-5xl font-extrabold tracking-tight">Esta página no está radicada.</h1>
        <p className="mt-4 text-ink-soft">La dirección no existe o cambió. Volvamos a un lugar conocido.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Cta href="/">Ir al inicio</Cta>
          <Cta href="/servicios" variant="line">Ver servicios</Cta>
        </div>
      </div>
    </section>
  );
}
