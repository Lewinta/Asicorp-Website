import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { EvaluacionForm } from "@/components/contacto/evaluacion-form";
import { PageHero } from "@/components/site/primitives";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto y evaluación gratuita",
  description:
    "Contacte a ASICORP: Av. Independencia 603, suite B3-B4, Santo Domingo, D.N. Teléfono (809) 769-5810, info@asicorprd.com.",
  alternates: { canonical: "/contacto" },
};

const mapSrc =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent("Av. Independencia 603, Santo Domingo, República Dominicana") +
  "&z=15&output=embed";

export default function ContactoPage() {
  return (
    <div className="pb-24">
      <PageHero
        folio="Contacto"
        title={
          <>
            Hablemos de <em className="text-primary">su flujo de caja</em>.
          </>
        }
        lead="Escríbanos, llámenos o visítenos en la Av. Independencia. Le respondemos en horario laborable."
      />

        <section className="container-page mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Información + mapa */}
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[6px] border border-rule bg-white p-5">
                  <MapPin className="h-6 w-6 text-primary" />
                  <p className="mt-3 folio text-ink">Oficina</p>
                  <p className="text-ink-soft">{siteConfig.contact.address}</p>
                </div>
                <div className="rounded-[6px] border border-rule bg-white p-5">
                  <Phone className="h-6 w-6 text-primary" />
                  <p className="mt-3 folio text-ink">Teléfono</p>
                  <a
                    href={`tel:+1${siteConfig.contact.phone.replace(/\D/g, "")}`}
                    className="text-ink-soft hover:text-primary"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
                <div className="rounded-[6px] border border-rule bg-white p-5">
                  <Mail className="h-6 w-6 text-primary" />
                  <p className="mt-3 folio text-ink">Correo</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="break-all text-ink-soft hover:text-primary"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div className="rounded-[6px] border border-rule bg-white p-5">
                  <Clock className="h-6 w-6 text-primary" />
                  <p className="mt-3 folio text-ink">Horario</p>
                  <p className="text-ink-soft">{siteConfig.contact.hours}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[6px] border border-rule">
                <iframe
                  title="Ubicación de Asicorp"
                  src={mapSrc}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Formulario */}
            <EvaluacionForm />
          </div>
        </section>
    </div>
  );
}
