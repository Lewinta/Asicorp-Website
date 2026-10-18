import { Hero } from "@/components/site/hero";
import { Simulador } from "@/components/site/simulador";
import {
  Beneficios,
  Ciclo,
  Cierre,
  Complementarios,
  Desafio,
  Impacto,
  Inversion,
  Preguntas,
  ProximosPasos,
} from "@/components/site/secciones";
import { preguntas } from "@/lib/contenido";

// Preguntas frecuentes en JSON-LD para Google y motores de respuesta.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: preguntas.map((p) => ({
    "@type": "Question",
    name: p.q,
    acceptedAnswer: { "@type": "Answer", text: p.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Desafio />
      <Ciclo />
      <Impacto />
      <Simulador />
      <Beneficios />
      <Complementarios />
      <Inversion />
      <ProximosPasos />
      <Preguntas />
      <Cierre />
    </>
  );
}
