import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Cta, PageHero } from "@/components/site/primitives";
import { Ciclo, Cierre, Complementarios, Inversion, Preguntas } from "@/components/site/secciones";

export const metadata: Metadata = {
  title: "Servicios: cesión de crédito para el sector salud",
  description:
    "Auditoría forense de la facturación, radicación ante las ARS, anticipo del total facturado en 4 días hábiles y cobranza con conciliación. Además: análisis de costos, negociación tarifaria con las ARS y auditoría médica.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        folio="Servicios · Cesión de crédito"
        title={
          <>
            Auditamos, radicamos, <span className="text-gradient-brand">anticipamos</span> y cobramos su facturación a las ARS.
          </>
        }
        lead="Un servicio integral y mensual para clínicas, centros de diagnóstico, laboratorios y profesionales de la salud. No es un préstamo: sin garantías ni avales."
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Cta href="/evaluacion">
            Agendar reunión de diagnóstico <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Cta>
          <Cta href="#inversion" variant="line">
            Ver la tarifa
          </Cta>
        </div>
      </PageHero>
      <Ciclo id="cesion" num="01" />
      <Complementarios id="complementarios" num="02" />
      <Inversion num="03" />
      <Preguntas num="04" />
      <Cierre />
    </>
  );
}
