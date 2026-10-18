import type { Metadata } from "next";
import Image from "next/image";
import { cifras, clientesObjetivo } from "@/lib/contenido";
import { PageHero, Rise, SectionHead, Sello } from "@/components/site/primitives";
import { Cierre } from "@/components/site/secciones";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "ASICORP (Asesores e Interventores Corporativos, S.R.L.): profesionales con amplia trayectoria en el sector financiero, las ARS y el Sistema Dominicano de Seguridad Social.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        folio="Nosotros · Asesores e Interventores Corporativos, S.R.L."
        title={
          <>
            Conocemos las ARS <em className="text-primary">desde adentro</em>.
          </>
        }
        lead="Somos profesionales con amplia trayectoria en el sector financiero, las ARS y el Sistema Dominicano de Seguridad Social."
      />

      <section className="bg-white py-24 md:py-32">
        <div className="container-page mx-auto grid max-w-7xl items-center gap-14 md:px-8 lg:grid-cols-2 lg:gap-20">
          <Rise className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
              <Image
                src="/brand/oficina-asicorp.webp"
                alt="Fachada de la oficina de ASICORP en la Av. Independencia 603, Santo Domingo"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[50%_18%]"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -right-3 md:-right-6">
              <Sello tono="azul" rotate={-7}>Santo Domingo, D.N.</Sello>
            </div>
          </Rise>

          <div>
            <SectionHead
              folio="Quiénes somos"
              title={
                <>
                  Fortalecemos la operación y el <em className="text-primary">flujo de caja</em> de las instituciones de salud.
                </>
              }
              lead="Sin préstamos, garantías ni avales. Cada mes auditamos su facturación, la radicamos ante las ARS, le anticipamos el total facturado y nos encargamos del cobro y la conciliación, con un software especializado desarrollado para el mercado local."
            />
            <Rise delay={0.1}>
              <p className="folio mt-10 text-ink-soft">Trabajamos con</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {clientesObjetivo.map((c) => (
                  <li key={c} className="rounded-[4px] border border-rule bg-paper px-3 py-2 text-sm text-ink">
                    {c}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-page mx-auto max-w-7xl md:px-8">
          <dl className="grid grid-cols-2 border-y border-rule lg:grid-cols-4">
            {cifras.map((c) => (
              <div key={c.etiqueta} className="flex flex-col gap-2 border-rule px-2 py-10 odd:border-r sm:px-6 lg:border-r lg:last:border-r-0">
                <dt className="order-2 text-sm text-ink-soft">{c.etiqueta}</dt>
                <dd className="order-1 font-serif text-6xl text-ink">{c.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-24 grid gap-px overflow-hidden rounded-[6px] border border-rule bg-rule md:grid-cols-2">
            <Rise className="bg-white p-8 md:p-12">
              <p className="folio text-primary">Misión</p>
              <p className="mt-5 font-serif text-2xl leading-snug text-ink md:text-3xl">
                Brindar liquidez y soluciones financieras integrales al sector salud, con agilidad y transparencia,
                para que sus instituciones crezcan sanas y ordenadas.
              </p>
            </Rise>
            <Rise delay={0.1} className="bg-white p-8 md:p-12">
              <p className="folio text-primary">Visión</p>
              <p className="mt-5 font-serif text-2xl leading-snug text-ink md:text-3xl">
                Ser el aliado financiero de referencia del sector salud en República Dominicana.
              </p>
            </Rise>
          </div>
        </div>
      </section>

      <Cierre />
    </>
  );
}
