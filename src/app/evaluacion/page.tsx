import type { Metadata } from "next";
import { EvaluacionForm } from "@/components/contacto/evaluacion-form";
import { SnapSection } from "@/components/motion/snap-section";

export const metadata: Metadata = {
  title: "Evaluación gratuita",
  description:
    "Solicita tu evaluación gratuita de factoring con Asicorp. Cuéntanos cuánto facturas a las ARS y un representante te dará seguimiento.",
};

export default function EvaluacionPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <SnapSection>
        <section className="relative overflow-hidden pt-32 md:pt-40">
          <div className="pointer-events-none absolute inset-0 line-texture opacity-40" />
          <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--brand-blue)_0%,transparent_65%)] opacity-15 blur-3xl" />
          <div className="container-page relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Gratis y sin compromiso
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Solicita tu <span className="text-gradient-brand">evaluación gratuita</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Descubre cuánta liquidez puedes obtener por tus cuentas por cobrar a las
              ARS. Sin costo, sin compromiso y sin afectar tu crédito.
            </p>
          </div>
        </section>
      </SnapSection>

      {/* Formulario */}
      <SnapSection>
        <section className="container-page mx-auto mt-12 max-w-2xl px-5 md:px-8">
          <EvaluacionForm />
        </section>
      </SnapSection>
    </div>
  );
}
