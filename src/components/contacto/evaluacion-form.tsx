"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";

const inputCls =
  "h-12 w-full rounded-[4px] border border-rule bg-white px-3 text-base text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const tiposEntidad = [
  "Clínica",
  "Centro de diagnóstico",
  "Laboratorio",
  "Profesional de la salud",
  "Otro",
];

const rangosFacturacion = [
  "Menos de RD$500,000 / mes",
  "RD$500,000 a RD$1,000,000 / mes",
  "RD$1,000,000 a RD$3,000,000 / mes",
  "RD$3,000,000 a RD$10,000,000 / mes",
  "Más de RD$10,000,000 / mes",
];

/**
 * Solicitud de reunión de diagnóstico. El sitio no guarda datos: al enviar se abre
 * WhatsApp con la solicitud ya redactada para el equipo de ASICORP.
 */
export function EvaluacionForm() {
  const [url, setUrl] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const lineas = [
      "Hola ASICORP, quiero agendar una reunión de diagnóstico.",
      `Nombre: ${v("nombre")}`,
      `Institución: ${v("institucion")} (${v("tipo")})`,
      `Facturación a las ARS: ${v("facturacion")}`,
      `Teléfono: ${v("telefono")}`,
      v("correo") && `Correo: ${v("correo")}`,
      v("mensaje") && `Comentario: ${v("mensaje")}`,
    ].filter(Boolean);
    const destino = whatsappUrl(lineas.join("\n"));
    setUrl(destino);
    window.open(destino, "_blank", "noopener,noreferrer");
  }

  if (url) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid place-items-center rounded-[6px] border border-rule bg-white p-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-money" strokeWidth={1.5} />
        <h3 className="mt-4 text-3xl text-ink font-bold">Su solicitud está lista</h3>
        <p className="mt-2 max-w-sm text-ink-soft">
          Abrimos WhatsApp con sus datos. Solo tiene que pulsar enviar. Si no se abrió, use el botón.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-navy-deep px-6 text-white hover:bg-primary"
        >
          <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
        </a>
        <button type="button" onClick={() => setUrl(null)} className="mt-4 text-sm text-ink-soft underline-offset-4 hover:underline">
          Editar la solicitud
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[6px] border border-rule bg-white p-6 md:p-10">
      <div>
        <p className="folio text-primary">Reunión de diagnóstico</p>
        <h2 className="mt-3 text-3xl text-ink font-bold">Cuéntenos sobre su institución</h2>
        <p className="mt-2 text-sm text-ink-soft">Sin costo ni compromiso. Le respondemos por WhatsApp o por teléfono.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nombre completo" htmlFor="ev-nombre">
          <input id="ev-nombre" name="nombre" required autoComplete="name" className={inputCls} />
        </Campo>
        <Campo label="Institución" htmlFor="ev-institucion">
          <input id="ev-institucion" name="institucion" required autoComplete="organization" className={inputCls} />
        </Campo>
        <Campo label="Tipo de institución" htmlFor="ev-tipo">
          <select id="ev-tipo" name="tipo" required defaultValue="" className={inputCls}>
            <option value="" disabled>Seleccione</option>
            {tiposEntidad.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Facturación mensual a las ARS" htmlFor="ev-facturacion">
          <select id="ev-facturacion" name="facturacion" required defaultValue="" className={inputCls}>
            <option value="" disabled>Seleccione un rango</option>
            {rangosFacturacion.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Teléfono" htmlFor="ev-telefono">
          <input id="ev-telefono" name="telefono" required type="tel" autoComplete="tel" className={inputCls} placeholder="(809) 000-0000" />
        </Campo>
        <Campo label="Correo (opcional)" htmlFor="ev-correo">
          <input id="ev-correo" name="correo" type="email" autoComplete="email" className={inputCls} />
        </Campo>
        <Campo label="Comentario (opcional)" htmlFor="ev-mensaje" className="sm:col-span-2">
          <textarea
            id="ev-mensaje"
            name="mensaje"
            rows={3}
            maxLength={600}
            className="w-full rounded-[4px] border border-rule bg-white px-3 py-2.5 text-base text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Campo>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-soft">
          También puede llamarnos al{" "}
          <a href={`tel:+1${siteConfig.contact.phone.replace(/\D/g, "")}`} className="text-ink underline-offset-4 hover:underline">
            {siteConfig.contact.phone}
          </a>
          .
        </p>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-navy-deep px-6 font-medium text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
