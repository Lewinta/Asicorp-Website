import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { EvaluacionForm } from "@/components/contacto/evaluacion-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto y evaluación gratuita",
  description:
    "Solicita tu evaluación gratuita de factoring con Asicorp. Av. Independencia 603, Santo Domingo. info@asicorprd.com · (809) 979-5810.",
};

const mapSrc =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent("Av. Independencia 603, Santo Domingo, República Dominicana") +
  "&z=15&output=embed";

export default function ContactoPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 dot-texture opacity-40" />
        <div className="container-page relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Evaluación gratuita
          </span>
          <h1 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
            Hablemos de tu <span className="text-gradient-brand">liquidez</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Déjanos tus datos y cuánto facturas. Un representante de Asicorp te
            contactará para darte seguimiento, sin costo ni compromiso.
          </p>
        </div>
      </section>

      <section className="container-page mx-auto mt-14 max-w-6xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Información + mapa */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <MapPin className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">Oficina</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contact.address}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <Phone className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">Teléfono</p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <Mail className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">Correo</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-sm text-muted-foreground hover:text-primary"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <Clock className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">Horario</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contact.hours}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border">
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
