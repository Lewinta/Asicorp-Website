import type { Metadata } from "next";
import { EvaluacionForm } from "@/components/contacto/evaluacion-form";
import { PageHero } from "@/components/site/primitives";
import { proximosPasos } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Reunión de diagnóstico",
  description:
    "Agende una reunión de diagnóstico con ASICORP: conocemos su operación, revisamos una muestra de sus reclamaciones a las ARS y le presentamos una propuesta según su volumen.",
  alternates: { canonical: "/evaluacion" },
};

export default function EvaluacionPage() {
  return (
    <>
      <PageHero
        folio="Paso 1 · Reunión de diagnóstico"
        title={
          <>
            Empecemos por conocer <span className="text-gradient-brand">su ciclo de facturación</span>.
          </>
        }
        lead="Sin costo, sin compromiso de permanencia y sin afectar su crédito."
      />
      <section className="container-page mx-auto grid max-w-7xl gap-12 pb-24 md:px-8 lg:grid-cols-[0.7fr_1.3fr]">
        <ol className="space-y-6 self-start border-t border-ink pt-6">
          {proximosPasos.map((p, i) => (
            <li key={p.titulo} className="grid grid-cols-[2.5rem_1fr] gap-3">
              <span className="text-sm text-stamp font-semibold tabular">0{i + 1}</span>
              <div>
                <p className="text-xl text-ink font-bold">{p.titulo}</p>
                <p className="mt-1 text-sm text-ink-soft">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
        <EvaluacionForm />
      </section>
    </>
  );
}
